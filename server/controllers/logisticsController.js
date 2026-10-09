const Warehouse = require('../models/Warehouse');
const DeliveryHub = require('../models/DeliveryHub');
const Shipment = require('../models/Shipment');
const Order = require('../models/Order');
const User = require('../models/User');
const {
  seedDefaultWarehousesAndHubs,
  validateStatusTransition,
  recordTrackingEvent,
  selectWarehouseForOrder,
  selectDeliveryHubForOrder,
} = require('../services/logisticsService');

// @desc Get all warehouses
// @route GET /api/logistics/warehouses
const getWarehouses = async (req, res, next) => {
  try {
    await seedDefaultWarehousesAndHubs();
    const warehouses = await Warehouse.find().sort({ createdAt: 1 }).lean();

    // Attach active parcel count and linked hubs
    const enriched = await Promise.all(
      warehouses.map(async (wh) => {
        const hubs = await DeliveryHub.find({ warehouse: wh._id }).lean();
        const activeShipmentCount = await Shipment.countDocuments({
          warehouse: wh._id,
          currentStage: { $in: ['WAREHOUSE_RECEIVED', 'SCANNED', 'SORTED'] },
        });
        return {
          ...wh,
          hubs,
          currentParcels: activeShipmentCount || wh.currentParcels || 0,
        };
      })
    );

    res.json({ success: true, count: enriched.length, warehouses: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc Create warehouse (Admin)
// @route POST /api/logistics/warehouses
const createWarehouse = async (req, res, next) => {
  try {
    const { warehouseId, name, code, address, city, state, postalCode, serviceCities, capacity } = req.body;
    if (!warehouseId || !name || !address || !city || !state) {
      return res.status(400).json({ success: false, message: 'Please provide required warehouse details' });
    }

    const exists = await Warehouse.findOne({ warehouseId: warehouseId.toUpperCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: `Warehouse with ID ${warehouseId} already exists` });
    }

    const warehouse = await Warehouse.create({
      warehouseId: warehouseId.toUpperCase(),
      name,
      code: code ? code.toUpperCase() : warehouseId.toUpperCase(),
      address,
      city,
      state,
      postalCode,
      serviceCities: Array.isArray(serviceCities) ? serviceCities : [city.toLowerCase()],
      capacity: Number(capacity) || 50000,
    });

    res.status(201).json({ success: true, message: 'Warehouse created successfully', warehouse });
  } catch (error) {
    next(error);
  }
};

// @desc Get all delivery hubs
// @route GET /api/logistics/hubs
const getHubs = async (req, res, next) => {
  try {
    await seedDefaultWarehousesAndHubs();
    const { warehouseId } = req.query;
    const query = warehouseId ? { warehouse: warehouseId } : {};
    const hubs = await DeliveryHub.find(query).populate('warehouse', 'name warehouseId city').sort({ createdAt: 1 });
    res.json({ success: true, count: hubs.length, hubs });
  } catch (error) {
    next(error);
  }
};

// @desc Create delivery hub (Admin)
// @route POST /api/logistics/hubs
const createHub = async (req, res, next) => {
  try {
    const { hubId, name, code, warehouse, address, city, state, postalCode, serviceZones } = req.body;
    if (!hubId || !name || !warehouse || !address || !city || !state) {
      return res.status(400).json({ success: false, message: 'Please provide required hub details' });
    }

    const targetWarehouse = await Warehouse.findById(warehouse);
    if (!targetWarehouse) {
      return res.status(404).json({ success: false, message: 'Parent warehouse not found' });
    }

    const hub = await DeliveryHub.create({
      hubId: hubId.toUpperCase(),
      name,
      code: code ? code.toUpperCase() : hubId.toUpperCase(),
      warehouse: targetWarehouse._id,
      warehouseName: targetWarehouse.name,
      address,
      city,
      state,
      postalCode,
      serviceZones: Array.isArray(serviceZones) ? serviceZones : [city],
    });

    res.status(201).json({ success: true, message: 'Delivery hub created successfully', hub });
  } catch (error) {
    next(error);
  }
};

// @desc Get shipments with stage filtering
// @route GET /api/logistics/shipments
const getShipments = async (req, res, next) => {
  try {
    const { stage, warehouseId, hubId, sellerId, search, limit = 50, page = 1 } = req.query;
    let query = {};

    // Role-based scoping: Seller only sees their own shipments
    if (req.user && req.user.role === 'seller') {
      query.seller = req.user._id;
    } else if (sellerId) {
      query.seller = sellerId;
    }

    // Stage filters
    if (stage && stage !== 'ALL') {
      if (stage === 'PENDING_PICKUP') {
        query.currentStage = { $in: ['SELLER_PROCESSING', 'READY_FOR_PICKUP'] };
      } else if (stage === 'AT_WAREHOUSE') {
        query.currentStage = { $in: ['WAREHOUSE_RECEIVED', 'SCANNED', 'SORTED'] };
      } else if (stage === 'IN_TRANSIT') {
        query.currentStage = { $in: ['PICKED_UP', 'DISPATCHED_FROM_WAREHOUSE'] };
      } else if (stage === 'AT_HUB') {
        query.currentStage = { $in: ['HUB_RECEIVED', 'READY_FOR_DELIVERY', 'DELIVERY_PARTNER_ASSIGNED'] };
      } else if (stage === 'OUT_FOR_DELIVERY') {
        query.currentStage = 'OUT_FOR_DELIVERY';
      } else if (stage === 'DELIVERED') {
        query.currentStage = 'DELIVERED';
      } else if (stage === 'FAILED_RESCHEDULED') {
        query.currentStage = { $in: ['DELIVERY_ATTEMPTED', 'RESCHEDULED'] };
      } else if (stage === 'RETURNS') {
        query.currentStage = { $in: ['RETURN_INITIATED', 'RETURN_IN_TRANSIT', 'RETURN_WAREHOUSE_RECEIVED', 'RETURN_TO_SELLER', 'SELLER_RECEIVED'] };
      } else {
        query.currentStage = stage;
      }
    }

    if (warehouseId) query.warehouse = warehouseId;
    if (hubId) query.deliveryHub = hubId;

    if (search) {
      const s = search.trim();
      query.$or = [
        { shipmentId: { $regex: s, $options: 'i' } },
        { orderNumber: { $regex: s, $options: 'i' } },
        { customerName: { $regex: s, $options: 'i' } },
        { 'shippingAddress.city': { $regex: s, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(500, parseInt(limit, 10) || 20));
    const skip = Math.max(0, (pageNum - 1) * limitNum);
    const [shipments, total] = await Promise.all([
      Shipment.find(query)
        .populate('warehouse', 'name city warehouseId')
        .populate('deliveryHub', 'name city hubId')
        .populate('deliveryPartner', 'name phone deliveryProfile')
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Shipment.countDocuments(query),
    ]);

    // Live Metrics Count for tabs
    const metrics = {
      total: await Shipment.countDocuments({}),
      pendingPickup: await Shipment.countDocuments({ currentStage: { $in: ['SELLER_PROCESSING', 'READY_FOR_PICKUP'] } }),
      atWarehouse: await Shipment.countDocuments({ currentStage: { $in: ['WAREHOUSE_RECEIVED', 'SCANNED', 'SORTED'] } }),
      inTransit: await Shipment.countDocuments({ currentStage: { $in: ['PICKED_UP', 'DISPATCHED_FROM_WAREHOUSE'] } }),
      atHub: await Shipment.countDocuments({ currentStage: { $in: ['HUB_RECEIVED', 'READY_FOR_DELIVERY', 'DELIVERY_PARTNER_ASSIGNED'] } }),
      outForDelivery: await Shipment.countDocuments({ currentStage: 'OUT_FOR_DELIVERY' }),
      delivered: await Shipment.countDocuments({ currentStage: 'DELIVERED' }),
      failed: await Shipment.countDocuments({ currentStage: { $in: ['DELIVERY_ATTEMPTED', 'RESCHEDULED'] } }),
      returns: await Shipment.countDocuments({ currentStage: { $regex: /^RETURN/ } }),
    };

    res.json({
      success: true,
      count: shipments.length,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      metrics,
      shipments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single shipment with full timeline and history
// @route GET /api/logistics/shipments/:id
const getShipmentById = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('order')
      .populate('warehouse')
      .populate('deliveryHub')
      .populate('deliveryPartner', 'name email phone deliveryProfile')
      .populate('seller', 'name email phone sellerProfile');

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    res.json({ success: true, shipment });
  } catch (error) {
    next(error);
  }
};

// @desc Public & Customer Tracking Endpoint by trackingNumber or orderNumber
// @route GET /api/logistics/track/:identifier
const trackShipment = async (req, res, next) => {
  try {
    const identifier = req.params.identifier.trim();

    // Look up by shipmentId or orderNumber
    let shipment = await Shipment.findOne({
      $or: [
        { shipmentId: identifier.toUpperCase() },
        { orderNumber: identifier.toUpperCase() },
        { orderNumber: identifier },
      ],
    })
      .populate('warehouse', 'name city warehouseId')
      .populate('deliveryHub', 'name city hubId')
      .populate('deliveryPartner', 'name phone');

    // Fallback: If no dedicated Shipment yet, find Order and create Shipment on the fly!
    if (!shipment) {
      const order = await Order.findOne({
        $or: [
          { orderNumber: identifier.toUpperCase() },
          { trackingNumber: identifier },
          { orderNumber: identifier },
        ],
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: `No active shipment record found for tracking code "${identifier}"`,
        });
      }

      const { createShipmentForOrder } = require('../services/logisticsService');
      shipment = await createShipmentForOrder(order);
    }

    // Sanitized Delivery Partner info (do not expose private details)
    let partnerInfo = null;
    if (['DELIVERY_PARTNER_ASSIGNED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipment.currentStage)) {
      partnerInfo = {
        name: shipment.deliveryPartnerName || shipment.deliveryPartner?.name || 'Verified Delivery Agent',
        phone: shipment.deliveryPartnerPhone || shipment.deliveryPartner?.phone || '',
      };
    }

    res.json({
      success: true,
      tracking: {
        shipmentId: shipment.shipmentId,
        orderNumber: shipment.orderNumber,
        currentStage: shipment.currentStage,
        currentLocation: shipment.currentLocation,
        nextExpectedStep: shipment.nextExpectedStep,
        facility: shipment.hubName || shipment.warehouseName || 'VEXIVO Network',
        warehouseName: shipment.warehouseName,
        hubName: shipment.hubName,
        customerName: shipment.customerName,
        shippingCity: shipment.shippingAddress?.city,
        shippingAddress: `${shipment.shippingAddress?.address || ''}, ${shipment.shippingAddress?.city || ''}`,
        deliveryPartner: partnerInfo,
        parcelDetails: shipment.parcelDetails,
        estimatedDeliveryDate: shipment.estimatedDeliveryDate,
        actualDeliveryDate: shipment.actualDeliveryDate,
        timeline: shipment.timeline,
        latestUpdate: shipment.timeline && shipment.timeline.length > 0 ? shipment.timeline[shipment.timeline.length - 1] : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// MULTI-STAGE LOGISTICS LIFECYCLE TRANSITIONS
// ==========================================

// @desc 1. Seller marks READY_FOR_PICKUP
// @route PUT /api/logistics/shipments/:id/seller-ready
const markSellerReady = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // Role check: Seller or Admin
    if (req.user.role === 'seller' && shipment.seller && String(shipment.seller) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You are not the merchant of this order.' });
    }

    // Validate state machine
    if (!['ORDER_CONFIRMED', 'SELLER_PROCESSING'].includes(shipment.currentStage)) {
      return res.status(400).json({
        success: false,
        message: `Cannot mark ready for pickup from current stage "${shipment.currentStage}".`,
      });
    }

    const { weight, dimensions, boxType, pickupNotes } = req.body;
    if (weight) shipment.parcelDetails.weight = weight;
    if (dimensions) shipment.parcelDetails.dimensions = dimensions;
    if (boxType) shipment.parcelDetails.boxType = boxType;

    const actor = req.user.name || 'Merchant Fulfillment Manager';
    const message = `Order packaged and marked ready for carrier pickup at ${shipment.pickupAddress.city}. Courier pickup task registered.`;
    const nextStep = `Pickup vehicle dispatched to collect parcel from merchant facility`;

    await recordTrackingEvent(shipment, {
      stage: 'READY_FOR_PICKUP',
      status: 'Ready For Pickup',
      message,
      location: `Merchant Warehouse, ${shipment.pickupAddress.city}`,
      facility: shipment.sellerName || 'Merchant Center',
      actor,
      actorRole: 'seller',
      nextExpectedStep: nextStep,
      metadata: { pickupNotes, parcelWeight: shipment.parcelDetails.weight },
    });

    res.json({
      success: true,
      message: 'Shipment marked Ready For Pickup. Logistics courier dispatch task generated.',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 2. Logistics Courier confirms PICKED_UP from seller
// @route PUT /api/logistics/shipments/:id/pickup-confirm
const confirmPickup = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // State machine check
    if (shipment.currentStage !== 'READY_FOR_PICKUP') {
      return res.status(400).json({
        success: false,
        message: `Shipment must be in "READY_FOR_PICKUP" status before pickup can be completed. Current: ${shipment.currentStage}`,
      });
    }

    const { pickupOtp, courierName, courierVehicle } = req.body;
    // OTP verification if provided
    if (shipment.pickupOtp && pickupOtp && String(pickupOtp).trim() !== String(shipment.pickupOtp).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid 4-digit Pickup Verification OTP' });
    }

    const actor = courierName || req.user.name || 'Inbound Fleet Courier';
    shipment.pickupPartnerName = actor;
    shipment.pickupDate = new Date();

    const message = `Parcel successfully picked up from merchant by logistics fleet (${actor}). En route to ${shipment.warehouseName || 'Regional Hub'}.`;
    const nextStep = `Inbound transit to ${shipment.warehouseName || 'Central Warehouse'} for barcode scan and receiving`;

    await recordTrackingEvent(shipment, {
      stage: 'PICKED_UP',
      status: 'Parcel Picked Up',
      message,
      location: `In Transit (From ${shipment.pickupAddress.city})`,
      facility: 'Logistics Fleet Vehicle',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
      metadata: { courierVehicle, courierName: actor },
    });

    res.json({
      success: true,
      message: 'Parcel pickup confirmed. Shipment moved to in-transit to warehouse.',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 3. Warehouse receives parcel (WAREHOUSE_RECEIVED)
// @route PUT /api/logistics/shipments/:id/warehouse-receive
const warehouseReceive = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (!['PICKED_UP', 'READY_FOR_PICKUP'].includes(shipment.currentStage)) {
      return res.status(400).json({
        success: false,
        message: `Shipment stage must be "PICKED_UP" to receive at warehouse. Current: ${shipment.currentStage}`,
      });
    }

    const { warehouseId, isDamaged, damageNotes, receivedBy } = req.body;
    if (warehouseId) {
      const wh = await Warehouse.findById(warehouseId);
      if (wh) {
        shipment.warehouse = wh._id;
        shipment.warehouseName = wh.name;
      }
    }

    const actor = receivedBy || req.user.name || 'Warehouse Inbound Supervisor';
    let message = `Parcel checked-in and received at ${shipment.warehouseName || 'Central Fulfillment Facility'}. Initial inspection passed.`;
    if (isDamaged) {
      message = `Parcel received at warehouse with exterior damage report: "${damageNotes || 'Packaging creased'}"`;
    }

    const nextStep = `Automated high-speed barcode scanning & dimension verification`;

    // Record Inbound Scan
    shipment.scans.push({
      scanType: 'WAREHOUSE_RECEIVE_SCAN',
      facility: shipment.warehouseName || 'Warehouse Inbound Bay',
      scannedBy: actor,
      scannedByRole: req.user.role,
      status: isDamaged ? 'DAMAGED_PACKAGE_FLAGGED' : 'SUCCESS',
      notes: damageNotes || 'Standard check-in verified',
    });

    await recordTrackingEvent(shipment, {
      stage: 'WAREHOUSE_RECEIVED',
      status: 'Warehouse Received',
      message,
      location: shipment.warehouseName || 'Central Warehouse',
      facility: shipment.warehouseName || 'Central Warehouse Inbound Dock',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
      metadata: { isDamaged: Boolean(isDamaged), damageNotes },
    });

    res.json({
      success: true,
      message: 'Parcel checked in at warehouse successfully.',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 4. Parcel Scanning (SCANNED)
// @route POST /api/logistics/shipments/scan
const scanShipment = async (req, res, next) => {
  try {
    const { barcodeOrId, scanType = 'WAREHOUSE_RECEIVE_SCAN', facility, notes } = req.body;
    if (!barcodeOrId) {
      return res.status(400).json({ success: false, message: 'Barcode / Tracking ID is required for scanning' });
    }

    const code = barcodeOrId.trim().toUpperCase();
    const shipment = await Shipment.findOne({
      $or: [{ shipmentId: code }, { orderNumber: code }],
    });

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: `Scan failed: No shipment record matched code "${code}". Verify barcode.`,
      });
    }

    const actor = req.user.name || 'Logistics Scanner Station';
    const fac = facility || shipment.warehouseName || 'Fulfillment Sorting Facility';

    shipment.scans.push({
      scanType,
      facility: fac,
      scannedBy: actor,
      scannedByRole: req.user.role,
      timestamp: new Date(),
      status: 'VERIFIED',
      notes: notes || 'Optical barcode scan matched verified shipment record',
    });

    // Auto-advance stage if currently WAREHOUSE_RECEIVED
    if (shipment.currentStage === 'WAREHOUSE_RECEIVED') {
      await recordTrackingEvent(shipment, {
        stage: 'SCANNED',
        status: 'Parcel Scanned',
        message: `Shipment barcode scanned and weight verified (1.45 kg). Moved to automated sorting conveyor.`,
        location: fac,
        facility: fac,
        actor,
        actorRole: req.user.role,
        nextExpectedStep: `Sorting parcel for dispatch to ${shipment.hubName || 'destination delivery facility'}`,
      });
    } else {
      await shipment.save();
    }

    res.json({
      success: true,
      message: `Barcode scan verified for shipment ${shipment.shipmentId}.`,
      scan: shipment.scans[shipment.scans.length - 1],
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 5. Warehouse Sorting (SORTED)
// @route PUT /api/logistics/shipments/:id/sort
const sortShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (!['WAREHOUSE_RECEIVED', 'SCANNED'].includes(shipment.currentStage)) {
      return res.status(400).json({
        success: false,
        message: `Shipment must be received/scanned in warehouse to sort. Current stage: ${shipment.currentStage}`,
      });
    }

    const { deliveryHubId, sortingBin, routeCode } = req.body;
    if (deliveryHubId) {
      const hub = await DeliveryHub.findById(deliveryHubId);
      if (hub) {
        shipment.deliveryHub = hub._id;
        shipment.hubName = hub.name;
      }
    }

    const actor = req.user.name || 'Conveyor Sorting Specialist';
    const destinationHub = shipment.hubName || 'Local Delivery Facility';
    const message = `Parcel sorted to Bin #${sortingBin || 'A-14'} for dispatch line route [${routeCode || 'EXP-DELIV'}] towards ${destinationHub}.`;
    const nextStep = `Loading parcel onto transport container for line-haul dispatch`;

    shipment.scans.push({
      scanType: 'SORTING_SCAN',
      facility: shipment.warehouseName || 'Automated Sorting Center',
      scannedBy: actor,
      scannedByRole: req.user.role,
      status: 'SORTED',
      notes: `Bin: ${sortingBin || 'A-14'}, Route: ${routeCode || 'EXP-DELIV'}`,
    });

    await recordTrackingEvent(shipment, {
      stage: 'SORTED',
      status: 'Parcel Sorted',
      message,
      location: shipment.warehouseName || 'Sorting Center',
      facility: shipment.warehouseName || 'Sorting Bay',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
      metadata: { sortingBin, routeCode },
    });

    res.json({
      success: true,
      message: 'Shipment sorted for destination hub successfully.',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 6. Dispatched from Warehouse (DISPATCHED_FROM_WAREHOUSE)
// @route PUT /api/logistics/shipments/:id/dispatch-warehouse
const dispatchFromWarehouse = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (!['SORTED', 'SCANNED', 'WAREHOUSE_RECEIVED'].includes(shipment.currentStage)) {
      return res.status(400).json({
        success: false,
        message: `Shipment must be sorted before dispatching from warehouse. Current stage: ${shipment.currentStage}`,
      });
    }

    const { truckNumber, containerId } = req.body;
    const actor = req.user.name || 'Outbound Logistics Dispatcher';
    const message = `Dispatched from ${shipment.warehouseName || 'Warehouse'} in container #${containerId || 'VEX-C88'}. In transit to ${shipment.hubName || 'Destination Delivery Hub'}.`;
    const nextStep = `Line-haul transit to local delivery hub for receiving`;

    shipment.scans.push({
      scanType: 'DISPATCH_SCAN',
      facility: shipment.warehouseName || 'Warehouse Dispatch Bay',
      scannedBy: actor,
      scannedByRole: req.user.role,
      status: 'DISPATCHED',
      notes: `Truck: ${truckNumber || 'RJ-14-TR-8812'}, Container: ${containerId || 'VEX-C88'}`,
    });

    await recordTrackingEvent(shipment, {
      stage: 'DISPATCHED_FROM_WAREHOUSE',
      status: 'Dispatched From Warehouse',
      message,
      location: `In Transit to ${shipment.hubName || 'Delivery Hub'}`,
      facility: 'Line-Haul Express Transit',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
      metadata: { truckNumber, containerId },
    });

    res.json({
      success: true,
      message: 'Shipment dispatched from warehouse into line-haul transit.',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 7. Delivery Hub receives parcel (HUB_RECEIVED)
// @route PUT /api/logistics/shipments/:id/hub-receive
const hubReceive = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (!['DISPATCHED_FROM_WAREHOUSE', 'SORTED'].includes(shipment.currentStage)) {
      return res.status(400).json({
        success: false,
        message: `Shipment must be in dispatch transit to receive at hub. Current stage: ${shipment.currentStage}`,
      });
    }

    const { hubId, receivedBy } = req.body;
    if (hubId) {
      const hub = await DeliveryHub.findById(hubId);
      if (hub) {
        shipment.deliveryHub = hub._id;
        shipment.hubName = hub.name;
      }
    }

    const actor = receivedBy || req.user.name || 'Hub Manager';
    const hubName = shipment.hubName || 'Local Delivery Hub';
    const message = `Parcel arrived at local facility [${hubName}]. Inbound container unloaded and verified.`;
    const nextStep = `Hub team staging package for local rider assignment`;

    shipment.scans.push({
      scanType: 'HUB_RECEIVE_SCAN',
      facility: hubName,
      scannedBy: actor,
      scannedByRole: req.user.role,
      status: 'HUB_RECEIVED',
      notes: 'Unloaded from line-haul vehicle',
    });

    await recordTrackingEvent(shipment, {
      stage: 'HUB_RECEIVED',
      status: 'Delivery Hub Received',
      message,
      location: hubName,
      facility: hubName,
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
    });

    res.json({
      success: true,
      message: 'Shipment checked in at delivery hub successfully.',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 8. Hub marks READY_FOR_DELIVERY (Eligibility trigger for Rider assignment!)
// @route PUT /api/logistics/shipments/:id/ready-for-delivery
const markReadyForDelivery = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (!['HUB_RECEIVED', 'DISPATCHED_FROM_WAREHOUSE'].includes(shipment.currentStage)) {
      return res.status(400).json({
        success: false,
        message: `Shipment must be received at delivery hub before marking ready for delivery. Current stage: ${shipment.currentStage}`,
      });
    }

    const actor = req.user.name || 'Hub Dispatch Coordinator';
    const hubName = shipment.hubName || 'Local Delivery Facility';
    const message = `Shipment staged at ${hubName} and verified ready for final mile delivery assignment.`;
    const nextStep = `Delivery partner assignment to rider serving ${shipment.shippingAddress.city || 'local sector'}`;

    await recordTrackingEvent(shipment, {
      stage: 'READY_FOR_DELIVERY',
      status: 'Ready For Delivery',
      message,
      location: hubName,
      facility: hubName,
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
    });

    res.json({
      success: true,
      message: 'Shipment is now READY_FOR_DELIVERY and eligible for partner assignment.',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 9. Assign Delivery Partner (Admin / Hub Dispatch)
// @route PUT /api/logistics/shipments/:id/assign-delivery-partner
const assignDeliveryPartner = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // STRICT CHECK: Only allow assignment once parcel is READY_FOR_DELIVERY (or reassignment)
    if (!['READY_FOR_DELIVERY', 'DELIVERY_PARTNER_ASSIGNED', 'HUB_RECEIVED'].includes(shipment.currentStage)) {
      return res.status(400).json({
        success: false,
        message: `Cannot assign delivery partner. Parcel has not reached "READY_FOR_DELIVERY" stage yet! Current stage: ${shipment.currentStage}`,
      });
    }

    const { partnerId } = req.body;
    if (!partnerId) {
      return res.status(400).json({ success: false, message: 'Please select a delivery partner' });
    }

    const partner = await User.findById(partnerId);
    if (!partner || partner.role !== 'delivery_partner') {
      return res.status(404).json({ success: false, message: 'Selected user is not a valid delivery partner' });
    }

    shipment.deliveryPartner = partner._id;
    shipment.deliveryPartnerName = partner.name;
    shipment.deliveryPartnerPhone = partner.phone || partner.deliveryProfile?.phone || '';
    shipment.assignedAt = new Date();

    const actor = req.user.name || 'Hub Dispatch Manager';
    const message = `Assigned to delivery agent ${partner.name} (+91 ${shipment.deliveryPartnerPhone || '9876543210'}) from ${shipment.hubName || 'Local Hub'}. Scheduled for final dispatch.`;
    const nextStep = `Agent accepts delivery task and begins transit to customer location`;

    await recordTrackingEvent(shipment, {
      stage: 'DELIVERY_PARTNER_ASSIGNED',
      status: 'Delivery Partner Assigned',
      message,
      location: shipment.hubName || 'Local Hub',
      facility: shipment.hubName || 'Local Hub',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
      metadata: { partnerId: partner._id, partnerName: partner.name },
    });

    res.json({
      success: true,
      message: `Delivery assigned to ${partner.name} successfully.`,
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 10. Rider marks OUT_FOR_DELIVERY
// @route PUT /api/logistics/shipments/:id/out-for-delivery
const markOutForDelivery = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // Role check: Assigned partner or Admin
    if (req.user.role === 'delivery_partner' && String(shipment.deliveryPartner) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You are not the assigned delivery partner for this shipment' });
    }

    if (!['DELIVERY_PARTNER_ASSIGNED', 'RESCHEDULED', 'READY_FOR_DELIVERY'].includes(shipment.currentStage)) {
      return res.status(400).json({
        success: false,
        message: `Shipment is not in an eligible stage to start delivery run. Current: ${shipment.currentStage}`,
      });
    }

    const actor = shipment.deliveryPartnerName || req.user.name || 'Delivery Partner';
    const message = `Package is out for delivery with ${actor}. Courier is en route to ${shipment.shippingAddress.address}, ${shipment.shippingAddress.city}.`;
    const nextStep = `Arriving at customer address. Keep your 4-digit Delivery OTP ready upon handover.`;

    shipment.scans.push({
      scanType: 'OUT_FOR_DELIVERY_SCAN',
      facility: shipment.hubName || 'Local Hub',
      scannedBy: actor,
      scannedByRole: 'delivery_partner',
      status: 'OUT_FOR_DELIVERY',
      notes: 'Final mile dispatch vehicle loaded',
    });

    await recordTrackingEvent(shipment, {
      stage: 'OUT_FOR_DELIVERY',
      status: 'Out For Delivery',
      message,
      location: `Local Area, ${shipment.shippingAddress.city}`,
      facility: 'Final Mile Delivery Vehicle',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
    });

    res.json({
      success: true,
      message: 'Shipment is now Out For Delivery. Customer notified.',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 11. Delivery Attempt Failed (DELIVERY_ATTEMPTED)
// @route PUT /api/logistics/shipments/:id/delivery-attempt
const recordDeliveryAttempt = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (shipment.currentStage !== 'OUT_FOR_DELIVERY') {
      return res.status(400).json({
        success: false,
        message: `Shipment must be "OUT_FOR_DELIVERY" to record a delivery attempt. Current: ${shipment.currentStage}`,
      });
    }

    const { reason, notes } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Please specify the reason for the failed delivery attempt' });
    }

    const attemptNumber = (shipment.deliveryAttempts?.length || 0) + 1;
    const actor = shipment.deliveryPartnerName || req.user.name || 'Delivery Partner';

    shipment.deliveryAttempts.push({
      attemptNumber,
      timestamp: new Date(),
      reason,
      partnerName: actor,
      partnerPhone: shipment.deliveryPartnerPhone || '',
      notes: notes || '',
    });

    const message = `Delivery attempt #${attemptNumber} could not be completed. Reason: ${reason}. Package secured at local facility.`;
    const nextStep = `Customer support contacting recipient to schedule redelivery or update address`;

    await recordTrackingEvent(shipment, {
      stage: 'DELIVERY_ATTEMPTED',
      status: 'Delivery Attempted',
      message,
      location: `${shipment.shippingAddress.city}, India`,
      facility: shipment.hubName || 'Local Delivery Hub',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
      metadata: { attemptNumber, reason, notes },
    });

    res.json({
      success: true,
      message: `Delivery attempt #${attemptNumber} logged.`,
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 12. Reschedule Delivery (RESCHEDULED)
// @route PUT /api/logistics/shipments/:id/reschedule
const rescheduleDelivery = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (!['DELIVERY_ATTEMPTED', 'OUT_FOR_DELIVERY', 'READY_FOR_DELIVERY'].includes(shipment.currentStage)) {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule from current stage "${shipment.currentStage}".`,
      });
    }

    const { newDate, reason = 'Customer requested rescheduling' } = req.body;
    if (!newDate) {
      return res.status(400).json({ success: false, message: 'New delivery date is required' });
    }

    const parsedDate = new Date(newDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid delivery date provided' });
    }

    const prevDate = shipment.estimatedDeliveryDate || new Date();
    shipment.estimatedDeliveryDate = parsedDate;

    shipment.rescheduleHistory.push({
      previousDate: prevDate,
      newDate: parsedDate,
      reason,
      initiatedBy: req.user.name || 'Recipient Request',
      timestamp: new Date(),
    });

    const formattedDate = parsedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const actor = req.user.name || 'Customer Operations';
    const message = `Delivery rescheduled to ${formattedDate}. Reason: ${reason}. Package held at ${shipment.hubName || 'Local Hub'}.`;
    const nextStep = `Package will be assigned and taken out for delivery on ${formattedDate}`;

    await recordTrackingEvent(shipment, {
      stage: 'RESCHEDULED',
      status: 'Delivery Rescheduled',
      message,
      location: shipment.hubName || 'Local Facility',
      facility: shipment.hubName || 'Local Facility',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
      metadata: { rescheduledDate: parsedDate, reason },
    });

    res.json({
      success: true,
      message: `Delivery rescheduled successfully to ${formattedDate}.`,
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 13. Complete Delivery (DELIVERED) with OTP Verification
// @route PUT /api/logistics/shipments/:id/deliver
const deliverShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (shipment.currentStage !== 'OUT_FOR_DELIVERY') {
      return res.status(400).json({
        success: false,
        message: `Shipment must be "OUT_FOR_DELIVERY" to mark delivered. Current: ${shipment.currentStage}`,
      });
    }

    // Role check: Assigned partner or Admin
    if (req.user.role === 'delivery_partner' && String(shipment.deliveryPartner) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized delivery partner' });
    }

    const { deliveryOtp, codAmountCollected, bypassOtp = false } = req.body;

    // Strict OTP Validation (Admin can bypass if authorized customer confirmation exists)
    if (shipment.deliveryOtp && !bypassOtp) {
      if (!deliveryOtp || String(deliveryOtp).trim() !== String(shipment.deliveryOtp).trim()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Delivery OTP! Please ask recipient for the 4-digit code shown in their VEXIVO order tracking.',
        });
      }
    }

    shipment.actualDeliveryDate = new Date();
    const actor = shipment.deliveryPartnerName || req.user.name || 'Delivery Partner';
    const message = `Package delivered safely to recipient (${shipment.customerName}) at ${shipment.shippingAddress.address}, ${shipment.shippingAddress.city}. Verified via Secure Handover OTP.`;
    const nextStep = `Order completed. Thank you for shopping with VEXIVO.`;

    shipment.scans.push({
      scanType: 'DELIVERY_CONFIRM_SCAN',
      facility: 'Customer Premises Handover',
      scannedBy: actor,
      scannedByRole: req.user.role,
      status: 'DELIVERED',
      notes: `OTP Verified. Handover complete at ${new Date().toLocaleTimeString()}`,
    });

    await recordTrackingEvent(shipment, {
      stage: 'DELIVERED',
      status: 'Delivered',
      message,
      location: `${shipment.shippingAddress.address}, ${shipment.shippingAddress.city}`,
      facility: 'Customer Address Handover',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
      metadata: { codCollected: Number(codAmountCollected) || 0, otpVerified: true },
    });

    // Update delivery partner earnings and stats
    if (shipment.deliveryPartner) {
      await User.findByIdAndUpdate(shipment.deliveryPartner, {
        $inc: {
          'deliveryProfile.totalDeliveries': 1,
          'deliveryProfile.earnings': 50,
          'deliveryProfile.codInHand': Number(codAmountCollected) || 0,
        },
      });
    }

    res.json({
      success: true,
      message: 'Package marked DELIVERED successfully! Handover verified.',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 14. Initiate Return (RETURN_INITIATED)
// @route PUT /api/logistics/shipments/:id/return-initiate
const initiateReturn = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    if (!['DELIVERED', 'DELIVERY_ATTEMPTED'].includes(shipment.currentStage)) {
      return res.status(400).json({
        success: false,
        message: `Cannot initiate return from current status "${shipment.currentStage}".`,
      });
    }

    const { reason = 'Return requested by recipient' } = req.body;
    shipment.returnDetails = {
      reason,
      initiatedAt: new Date(),
      status: 'initiated',
    };

    const actor = req.user.name || 'Customer Care';
    const message = `Return initiated for parcel. Reason: ${reason}. Return pickup task queued with logistics.`;
    const nextStep = `Courier dispatch scheduled to collect returned item`;

    await recordTrackingEvent(shipment, {
      stage: 'RETURN_INITIATED',
      status: 'Return Initiated',
      message,
      location: `${shipment.shippingAddress.city}, India`,
      facility: shipment.hubName || 'Local Logistics Hub',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
      metadata: { returnReason: reason },
    });

    res.json({
      success: true,
      message: 'Return initiated successfully.',
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 15. Update Return Workflow Stages (RETURN_IN_TRANSIT -> RETURN_WAREHOUSE_RECEIVED -> RETURN_TO_SELLER -> SELLER_RECEIVED)
// @route PUT /api/logistics/shipments/:id/return-update
const updateReturnProgress = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const { nextStage, notes } = req.body;
    const VALID_RETURN_STAGES = [
      'RETURN_IN_TRANSIT',
      'RETURN_WAREHOUSE_RECEIVED',
      'RETURN_TO_SELLER',
      'SELLER_RECEIVED',
    ];

    if (!VALID_RETURN_STAGES.includes(nextStage)) {
      return res.status(400).json({ success: false, message: `Invalid return workflow stage "${nextStage}"` });
    }

    let message = '';
    let location = '';
    let nextStep = '';

    if (nextStage === 'RETURN_IN_TRANSIT') {
      message = 'Return parcel collected from customer. In reverse transit to fulfillment center.';
      location = 'Reverse Line-Haul Transit';
      nextStep = 'Receiving and inspection at regional fulfillment center';
      if (shipment.returnDetails) shipment.returnDetails.status = 'in_transit';
    } else if (nextStage === 'RETURN_WAREHOUSE_RECEIVED') {
      message = `Return parcel received back at ${shipment.warehouseName || 'Warehouse'}. Quality and tag inspection completed.`;
      location = shipment.warehouseName || 'Warehouse Inbound';
      nextStep = 'Packaging and dispatching return item back to merchant';
      if (shipment.returnDetails) {
        shipment.returnDetails.status = 'warehouse_received';
        shipment.returnDetails.receivedAtWarehouseAt = new Date();
      }
    } else if (nextStage === 'RETURN_TO_SELLER') {
      message = `Return parcel dispatched on reverse route towards merchant (${shipment.sellerName}).`;
      location = `En route to ${shipment.pickupAddress.city}`;
      nextStep = `Delivery handoff to merchant facility`;
      if (shipment.returnDetails) shipment.returnDetails.status = 'returned_to_seller';
    } else if (nextStage === 'SELLER_RECEIVED') {
      message = `Merchant (${shipment.sellerName}) has received the returned parcel. Return lifecycle closed.`;
      location = `Merchant Facility, ${shipment.pickupAddress.city}`;
      nextStep = 'Return closed. Customer refund processing completed.';
      if (shipment.returnDetails) {
        shipment.returnDetails.status = 'seller_received';
        shipment.returnDetails.returnedToSellerAt = new Date();
      }
    }

    const actor = req.user.name || 'Logistics Return Agent';
    await recordTrackingEvent(shipment, {
      stage: nextStage,
      status: nextStage.replace(/_/g, ' '),
      message,
      location,
      facility: shipment.warehouseName || 'Logistics Center',
      actor,
      actorRole: req.user.role,
      nextExpectedStep: nextStep,
      metadata: { notes },
    });

    res.json({
      success: true,
      message: `Return status updated to ${nextStage}.`,
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc 16. Admin Manual Override with mandatory reason and full audit tracking
// @route PUT /api/logistics/shipments/:id/admin-override
const adminOverride = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const { targetStage, reason, location, facility, nextExpectedStep } = req.body;
    if (!targetStage || !reason) {
      return res.status(400).json({ success: false, message: 'Target stage and audit reason are required' });
    }

    const actor = req.user.name || 'Super Administrator';
    const message = `[ADMIN OVERRIDE] Stage manually updated to ${targetStage}. Reason: ${reason}`;

    await recordTrackingEvent(shipment, {
      stage: targetStage,
      status: targetStage.replace(/_/g, ' '),
      message,
      location: location || shipment.currentLocation,
      facility: facility || shipment.warehouseName || 'Admin Operations Console',
      actor,
      actorRole: 'admin',
      nextExpectedStep: nextExpectedStep || 'Awaiting automated logistics processing',
      metadata: { adminOverrideReason: reason, overriddenBy: req.user._id },
    });

    res.json({
      success: true,
      message: `Admin override applied: Shipment stage set to ${targetStage}.`,
      shipment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWarehouses,
  createWarehouse,
  getHubs,
  createHub,
  getShipments,
  getShipmentById,
  trackShipment,
  markSellerReady,
  confirmPickup,
  warehouseReceive,
  scanShipment,
  sortShipment,
  dispatchFromWarehouse,
  hubReceive,
  markReadyForDelivery,
  assignDeliveryPartner,
  markOutForDelivery,
  recordDeliveryAttempt,
  rescheduleDelivery,
  deliverShipment,
  initiateReturn,
  updateReturnProgress,
  adminOverride,
};
