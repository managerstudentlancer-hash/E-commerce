const Warehouse = require('../models/Warehouse');
const DeliveryHub = require('../models/DeliveryHub');
const Shipment = require('../models/Shipment');
const Order = require('../models/Order');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Default initial warehouses & delivery hubs across Indian metropolitans
const DEFAULT_WAREHOUSES = [
  {
    warehouseId: 'WH-JPR-01',
    name: 'VEXIVO Jaipur Central Fulfillment Center',
    code: 'JPR-MAIN',
    address: 'Plot 42-45, Sitapura Industrial Area, Tonk Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    postalCode: '302022',
    pincodes: ['302001', '302004', '302015', '302017', '302018', '302019', '302020', '302021', '302022'],
    serviceCities: ['jaipur', 'ajmer', 'kota', 'udaipur', 'jodhpur', 'bikaner'],
    capacity: 65000,
    currentParcels: 1420,
    managerName: 'Vikramaditya Rathore',
    contactPhone: '+91 141 289 9001',
    status: 'active',
    hubs: [
      {
        hubId: 'HUB-JPR-MANSAROVAR',
        name: 'Mansarovar Logistics & Delivery Hub',
        code: 'JPR-MSR',
        address: 'Sector 7, Madhyam Marg, Mansarovar',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302020',
        serviceZones: ['Mansarovar', 'Sanganer', 'Durgapura', 'Muhana', 'Ridhi Sidhi'],
        pincodes: ['302020', '302029', '302018'],
        managerName: 'Kailash Choudhary',
        contactPhone: '+91 141 289 9101',
      },
      {
        hubId: 'HUB-JPR-MALVIYA',
        name: 'Malviya Nagar Express Hub',
        code: 'JPR-MLV',
        address: 'Calgiri Marg, Near Apex Circle, Malviya Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302017',
        serviceZones: ['Malviya Nagar', 'Jagatpura', 'Pratap Nagar', 'Airport Area'],
        pincodes: ['302017', '302025', '302033'],
        managerName: 'Poonam Sharma',
        contactPhone: '+91 141 289 9102',
      },
      {
        hubId: 'HUB-JPR-CENTRAL',
        name: 'Jaipur City & Civil Lines Hub',
        code: 'JPR-CTR',
        address: 'Station Road, Kanti Nagar, Bani Park',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302006',
        serviceZones: ['Central', 'Civil Lines', 'C-Scheme', 'Bani Park', 'Vaishali Nagar', 'Raja Park'],
        pincodes: ['302001', '302006', '302021', '302004'],
        managerName: 'Sunil Verma',
        contactPhone: '+91 141 289 9103',
      },
    ],
  },
  {
    warehouseId: 'WH-DEL-01',
    name: 'VEXIVO Delhi NCR Mega Fulfillment Center',
    code: 'DEL-MEGA',
    address: 'Logistics Park, Bijwasan Road, Kapashera',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110037',
    pincodes: ['110001', '110016', '110020', '110024', '110048', '110070', '122001', '122002'],
    serviceCities: ['delhi', 'new delhi', 'gurugram', 'noida', 'ghaziabad', 'faridabad'],
    capacity: 120000,
    currentParcels: 3890,
    managerName: 'Devendra Mehra',
    contactPhone: '+91 11 4988 7700',
    status: 'active',
    hubs: [
      {
        hubId: 'HUB-DEL-SOUTH',
        name: 'South Delhi & Aerocity Delivery Hub',
        code: 'DEL-STH',
        address: 'Okhla Phase 3, Industrial Area',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110020',
        serviceZones: ['Saket', 'Hauz Khas', 'Okhla', 'Nehru Place', 'GK', 'Vasant Kunj'],
        pincodes: ['110017', '110019', '110020', '110048'],
        managerName: 'Amit Saxena',
        contactPhone: '+91 11 4988 7710',
      },
      {
        hubId: 'HUB-GURGAON-01',
        name: 'Gurugram Cyber City Express Facility',
        code: 'GGN-CYB',
        address: 'Sector 18, Udyog Vihar Phase 4',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122015',
        serviceZones: ['Cyber City', 'DLF Phase 1-5', 'Golf Course Road', 'Sector 29'],
        pincodes: ['122001', '122002', '122015'],
        managerName: 'Rohit Gill',
        contactPhone: '+91 124 455 2200',
      },
    ],
  },
  {
    warehouseId: 'WH-MUM-01',
    name: 'VEXIVO Mumbai Western Gateway Hub',
    code: 'BOM-WEST',
    address: 'Bhiwandi Logistics Park, Highway 84',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '421302',
    pincodes: ['400001', '400050', '400053', '400069', '400098'],
    serviceCities: ['mumbai', 'navi mumbai', 'thane', 'pune', 'nashik'],
    capacity: 90000,
    currentParcels: 2100,
    managerName: 'Sanjay Patwardhan',
    contactPhone: '+91 22 2844 5500',
    status: 'active',
    hubs: [
      {
        hubId: 'HUB-MUM-ANDHERI',
        name: 'Andheri & Suburban Delivery Hub',
        code: 'BOM-SUB',
        address: 'Saki Naka, Andheri East',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400072',
        serviceZones: ['Andheri East', 'Andheri West', 'Powai', 'Goregaon', 'Bandra'],
        pincodes: ['400053', '400069', '400072', '400050'],
        managerName: 'Pradeep Shetty',
        contactPhone: '+91 22 2844 5510',
      },
    ],
  },
  {
    warehouseId: 'WH-BLR-01',
    name: 'VEXIVO Bengaluru Tech Logistics Hub',
    code: 'BLR-TECH',
    address: 'Hosur Road, Bommasandra Industrial Area',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560099',
    pincodes: ['560001', '560034', '560038', '560066', '560100', '560102'],
    serviceCities: ['bengaluru', 'bangalore', 'mysuru', 'hosur', 'mangalore'],
    capacity: 85000,
    currentParcels: 1840,
    managerName: 'Chandrashekhar Rao',
    contactPhone: '+91 80 4122 8800',
    status: 'active',
    hubs: [
      {
        hubId: 'HUB-BLR-KORAMANGALA',
        name: 'Koramangala & Indiranagar Delivery Hub',
        code: 'BLR-KOR',
        address: '80 Feet Road, 4th Block, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560034',
        serviceZones: ['Koramangala', 'HSR Layout', 'Indiranagar', 'BTM Layout', 'Bellandur'],
        pincodes: ['560034', '560038', '560102', '560103'],
        managerName: 'Manoj Kumar Gowda',
        contactPhone: '+91 80 4122 8810',
      },
    ],
  },
  {
    warehouseId: 'WH-KOL-01',
    name: 'VEXIVO Kolkata Eastern Logistics Gateway',
    code: 'CCU-EAST',
    address: 'NH-6, Bombay Road, Dhulagarh Hub',
    city: 'Kolkata',
    state: 'West Bengal',
    postalCode: '711302',
    pincodes: ['700001', '700019', '700064', '700091'],
    serviceCities: ['kolkata', 'howrah', 'durgapur', 'siliguri'],
    capacity: 50000,
    currentParcels: 920,
    managerName: 'Subir Banerjee',
    contactPhone: '+91 33 2455 3300',
    status: 'active',
    hubs: [
      {
        hubId: 'HUB-KOL-SALT-LAKE',
        name: 'Salt Lake & New Town Delivery Hub',
        code: 'CCU-SLK',
        address: 'Sector V, Salt Lake City',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700091',
        serviceZones: ['Salt Lake', 'New Town', 'Rajarhat', 'Ultadanga', 'Kankurgachi'],
        pincodes: ['700091', '700156', '700064'],
        managerName: 'Anirban Mukherjee',
        contactPhone: '+91 33 2455 3310',
      },
    ],
  },
];

/**
 * Seed default Warehouses and Hubs if database has none
 */
const seedDefaultWarehousesAndHubs = async () => {
  try {
    const existingCount = await Warehouse.countDocuments();
    if (existingCount > 0) return;

    for (const whData of DEFAULT_WAREHOUSES) {
      const { hubs, ...whFields } = whData;
      const warehouse = await Warehouse.create(whFields);

      if (hubs && hubs.length > 0) {
        for (const hubData of hubs) {
          await DeliveryHub.create({
            ...hubData,
            warehouse: warehouse._id,
            warehouseName: warehouse.name,
          });
        }
      }
    }
    console.log('[Logistics Service] Default warehouses & delivery hubs seeded successfully');
  } catch (err) {
    console.warn('[Logistics Service] Auto-seed notice:', err.message);
  }
};

/**
 * Find the most appropriate Warehouse for an order
 */
const selectWarehouseForOrder = async (shippingAddress = {}, sellerAddress = {}) => {
  try {
    await seedDefaultWarehousesAndHubs();
    const warehouses = await Warehouse.find({ status: 'active' });
    if (!warehouses || warehouses.length === 0) return null;

    const shipCity = (shippingAddress.city || '').toLowerCase().trim();
    const shipPincode = (shippingAddress.postalCode || '').trim();
    const sellerCity = (sellerAddress.city || '').toLowerCase().trim();

    // 1. Direct city match for customer destination
    const destCityMatch = warehouses.find((w) =>
      w.city.toLowerCase() === shipCity || w.serviceCities.includes(shipCity)
    );
    if (destCityMatch) return destCityMatch;

    // 2. Direct pincode match
    if (shipPincode) {
      const pinMatch = warehouses.find((w) => w.pincodes.includes(shipPincode));
      if (pinMatch) return pinMatch;
    }

    // 3. Match seller origin city
    if (sellerCity) {
      const originMatch = warehouses.find((w) =>
        w.city.toLowerCase() === sellerCity || w.serviceCities.includes(sellerCity)
      );
      if (originMatch) return originMatch;
    }

    // 4. Default to Jaipur Central / First active warehouse
    return warehouses[0];
  } catch (err) {
    console.error('[Select Warehouse Error]:', err.message);
    return null;
  }
};

/**
 * Find the best Delivery Hub under the assigned warehouse
 */
const selectDeliveryHubForOrder = async (warehouseId, shippingAddress = {}) => {
  try {
    if (!warehouseId) return null;
    const hubs = await DeliveryHub.find({ warehouse: warehouseId, status: 'active' });
    if (!hubs || hubs.length === 0) {
      // Look for any active hub in the same city
      const shipCity = (shippingAddress.city || '').toLowerCase().trim();
      const cityHubs = await DeliveryHub.find({ status: 'active' });
      const matched = cityHubs.find((h) => h.city.toLowerCase() === shipCity);
      return matched || cityHubs[0] || null;
    }

    const shipAddr = (shippingAddress.address || '').toLowerCase();
    const shipCity = (shippingAddress.city || '').toLowerCase().trim();
    const shipPincode = (shippingAddress.postalCode || '').trim();

    // 1. Match service zone in destination address
    for (const hub of hubs) {
      if (hub.serviceZones && hub.serviceZones.length > 0) {
        for (const zone of hub.serviceZones) {
          if (zone && shipAddr.includes(zone.toLowerCase())) {
            return hub;
          }
        }
      }
    }

    // 2. Match pincode
    if (shipPincode) {
      const pinHub = hubs.find((h) => h.pincodes && h.pincodes.includes(shipPincode));
      if (pinHub) return pinHub;
    }

    // Default to the first hub under this warehouse
    return hubs[0];
  } catch (err) {
    console.error('[Select Delivery Hub Error]:', err.message);
    return null;
  }
};

/**
 * Multi-Stage Shipment State Machine Transition Validator
 * Prevents invalid/impossible status jumps!
 */
const ALLOWED_STAGE_TRANSITIONS = {
  ORDER_PLACED: ['ORDER_CONFIRMED', 'CANCELLED'],
  ORDER_CONFIRMED: ['SELLER_PROCESSING', 'CANCELLED'],
  SELLER_PROCESSING: ['READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['WAREHOUSE_RECEIVED'],
  WAREHOUSE_RECEIVED: ['SCANNED'],
  SCANNED: ['SORTED', 'DISPATCHED_FROM_WAREHOUSE'],
  SORTED: ['DISPATCHED_FROM_WAREHOUSE'],
  DISPATCHED_FROM_WAREHOUSE: ['HUB_RECEIVED'],
  HUB_RECEIVED: ['READY_FOR_DELIVERY'],
  READY_FOR_DELIVERY: ['DELIVERY_PARTNER_ASSIGNED'],
  DELIVERY_PARTNER_ASSIGNED: ['OUT_FOR_DELIVERY', 'READY_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'DELIVERY_ATTEMPTED'],
  DELIVERY_ATTEMPTED: ['RESCHEDULED', 'OUT_FOR_DELIVERY', 'RETURN_INITIATED'],
  RESCHEDULED: ['OUT_FOR_DELIVERY'],
  DELIVERED: ['RETURN_INITIATED'], // Customer-initiated return after delivery
  RETURN_INITIATED: ['RETURN_IN_TRANSIT', 'CANCELLED'],
  RETURN_IN_TRANSIT: ['RETURN_WAREHOUSE_RECEIVED'],
  RETURN_WAREHOUSE_RECEIVED: ['RETURN_TO_SELLER'],
  RETURN_TO_SELLER: ['SELLER_RECEIVED'],
  SELLER_RECEIVED: [],
  CANCELLED: [],
};

const validateStatusTransition = (currentStage, nextStage) => {
  if (currentStage === nextStage) return true;
  const allowed = ALLOWED_STAGE_TRANSITIONS[currentStage] || [];
  return allowed.includes(nextStage);
};

/**
 * Maps logistics stage to Order schema orderStatus and deliveryStatus
 */
const mapStageToOrderFields = (stage) => {
  switch (stage) {
    case 'ORDER_PLACED':
      return { orderStatus: 'pending', deliveryStatus: 'unassigned' };
    case 'ORDER_CONFIRMED':
      return { orderStatus: 'confirmed', deliveryStatus: 'unassigned' };
    case 'SELLER_PROCESSING':
      return { orderStatus: 'processing', deliveryStatus: 'unassigned' };
    case 'READY_FOR_PICKUP':
      return { orderStatus: 'ready_for_pickup', deliveryStatus: 'pending_pickup' };
    case 'PICKED_UP':
      return { orderStatus: 'picked_up', deliveryStatus: 'picked_up' };
    case 'WAREHOUSE_RECEIVED':
      return { orderStatus: 'warehouse_received', deliveryStatus: 'at_warehouse' };
    case 'SCANNED':
      return { orderStatus: 'scanned', deliveryStatus: 'at_warehouse' };
    case 'SORTED':
      return { orderStatus: 'sorted', deliveryStatus: 'sorted' };
    case 'DISPATCHED_FROM_WAREHOUSE':
      return { orderStatus: 'shipped', deliveryStatus: 'in_transit_to_hub' };
    case 'HUB_RECEIVED':
      return { orderStatus: 'hub_received', deliveryStatus: 'at_hub' };
    case 'READY_FOR_DELIVERY':
      return { orderStatus: 'ready_for_delivery', deliveryStatus: 'ready_for_delivery' };
    case 'DELIVERY_PARTNER_ASSIGNED':
      return { orderStatus: 'delivery_partner_assigned', deliveryStatus: 'assigned' };
    case 'OUT_FOR_DELIVERY':
      return { orderStatus: 'out_for_delivery', deliveryStatus: 'out_for_delivery' };
    case 'DELIVERY_ATTEMPTED':
      return { orderStatus: 'delivery_attempted', deliveryStatus: 'failed' };
    case 'RESCHEDULED':
      return { orderStatus: 'rescheduled', deliveryStatus: 'rescheduled' };
    case 'DELIVERED':
      return { orderStatus: 'delivered', deliveryStatus: 'delivered' };
    case 'RETURN_INITIATED':
      return { orderStatus: 'return_initiated', deliveryStatus: 'return_to_seller' };
    case 'RETURN_IN_TRANSIT':
      return { orderStatus: 'return_in_transit', deliveryStatus: 'return_to_seller' };
    case 'RETURN_WAREHOUSE_RECEIVED':
      return { orderStatus: 'warehouse_received', deliveryStatus: 'return_to_seller' };
    case 'RETURN_TO_SELLER':
      return { orderStatus: 'return_to_seller', deliveryStatus: 'return_to_seller' };
    case 'SELLER_RECEIVED':
      return { orderStatus: 'returned', deliveryStatus: 'return_to_seller' };
    case 'CANCELLED':
      return { orderStatus: 'cancelled', deliveryStatus: 'unassigned' };
    default:
      return { orderStatus: 'confirmed', deliveryStatus: 'unassigned' };
  }
};

/**
 * Record a tracking event in Shipment and synchronously update the Order
 */
const recordTrackingEvent = async (shipment, {
  stage,
  status,
  message,
  location,
  facility,
  actor = 'System',
  actorRole = 'system',
  metadata = {},
  nextExpectedStep = '',
}) => {
  const timestamp = new Date();

  // 1. Update Shipment fields
  shipment.currentStage = stage;
  if (location) shipment.currentLocation = location;
  if (nextExpectedStep) shipment.nextExpectedStep = nextExpectedStep;

  shipment.timeline.push({
    stage,
    status: status || stage.replace(/_/g, ' '),
    message,
    location: location || shipment.currentLocation,
    facility: facility || shipment.warehouseName || 'VEXIVO Logistics',
    actor,
    actorRole,
    timestamp,
    metadata,
  });

  await shipment.save();

  // 2. Synchronize Order fields and append to Order trackingHistory
  const orderFields = mapStageToOrderFields(stage);
  const orderUpdate = {
    $set: {
      orderStatus: orderFields.orderStatus,
      'deliveryDetails.deliveryStatus': orderFields.deliveryStatus,
      shipment: shipment._id,
    },
    $push: {
      trackingHistory: {
        status: status || stage.replace(/_/g, ' '),
        message,
        timestamp,
      },
    },
  };

  // Specific milestone timestamp additions
  if (stage === 'PICKED_UP') {
    orderUpdate.$set['deliveryDetails.pickedUpAt'] = timestamp;
  } else if (stage === 'OUT_FOR_DELIVERY') {
    orderUpdate.$set['deliveryDetails.outForDeliveryAt'] = timestamp;
  } else if (stage === 'DELIVERED') {
    orderUpdate.$set['deliveryDetails.deliveredAt'] = timestamp;
    orderUpdate.$set['deliveryDetails.deliveryStatus'] = 'delivered';
    orderUpdate.$set['paymentStatus'] = 'paid';
  } else if (stage === 'DELIVERY_PARTNER_ASSIGNED' && shipment.deliveryPartner) {
    orderUpdate.$set['deliveryPartner'] = shipment.deliveryPartner;
    orderUpdate.$set['deliveryPartnerName'] = shipment.deliveryPartnerName;
    orderUpdate.$set['deliveryPartnerPhone'] = shipment.deliveryPartnerPhone;
    orderUpdate.$set['deliveryDetails.assignedAt'] = timestamp;
  }

  await Order.findByIdAndUpdate(shipment.order, orderUpdate);

  // 3. Send Notifications via existing Notification system
  await sendLogisticsNotifications(shipment, stage, message);

  return shipment;
};

/**
 * Dispatch notifications to customer, seller, or delivery partner
 */
const sendLogisticsNotifications = async (shipment, stage, message) => {
  try {
    // Notify Customer
    if (shipment.customer) {
      let customerTitle = '';
      if (stage === 'ORDER_CONFIRMED') customerTitle = 'Order Confirmed & Processing';
      else if (stage === 'READY_FOR_PICKUP') customerTitle = 'Seller Packed Your Order';
      else if (stage === 'PICKED_UP') customerTitle = 'Package Picked Up by Courier';
      else if (stage === 'WAREHOUSE_RECEIVED') customerTitle = 'Package Received at Fulfillment Center';
      else if (stage === 'DISPATCHED_FROM_WAREHOUSE') customerTitle = 'Dispatched Towards Your Local Hub';
      else if (stage === 'HUB_RECEIVED') customerTitle = 'Arrived at Local Delivery Facility';
      else if (stage === 'DELIVERY_PARTNER_ASSIGNED') customerTitle = 'Delivery Agent Assigned';
      else if (stage === 'OUT_FOR_DELIVERY') customerTitle = 'Out For Delivery Today!';
      else if (stage === 'DELIVERY_ATTEMPTED') customerTitle = 'Delivery Attempt Notice';
      else if (stage === 'RESCHEDULED') customerTitle = 'Delivery Rescheduled';
      else if (stage === 'DELIVERED') customerTitle = 'Order Delivered Successfully!';
      else if (stage === 'RETURN_INITIATED') customerTitle = 'Return Request Underway';

      if (customerTitle) {
        await Notification.create({
          user: shipment.customer,
          title: customerTitle,
          message: `${message} (Tracking: ${shipment.shipmentId})`,
          type: 'order',
          link: `/account/orders`,
        });
      }
    }

    // Notify Seller
    if (shipment.seller) {
      let sellerTitle = '';
      if (stage === 'ORDER_CONFIRMED') sellerTitle = `New Order To Fulfill #${shipment.orderNumber}`;
      else if (stage === 'READY_FOR_PICKUP') sellerTitle = 'Pickup Scheduled with Logistics';
      else if (stage === 'PICKED_UP') sellerTitle = `Parcel #${shipment.shipmentId} Picked Up`;
      else if (stage === 'DELIVERED') sellerTitle = `Order #${shipment.orderNumber} Delivered (Payout Eligible)`;
      else if (stage === 'RETURN_INITIATED') sellerTitle = `Return Initiated for #${shipment.orderNumber}`;

      if (sellerTitle) {
        await Notification.create({
          user: shipment.seller,
          title: sellerTitle,
          message: `${message} (Shipment: ${shipment.shipmentId})`,
          type: 'seller',
          link: `/seller/dashboard`,
        });
      }
    }

    // Notify Delivery Partner
    if (shipment.deliveryPartner && (stage === 'DELIVERY_PARTNER_ASSIGNED' || stage === 'RESCHEDULED')) {
      await Notification.create({
        user: shipment.deliveryPartner,
        title: stage === 'RESCHEDULED' ? 'Delivery Task Rescheduled' : 'New Delivery Assignment Ready',
        message: `Shipment ${shipment.shipmentId} for ${shipment.shippingAddress?.city || 'customer'}. Ready for delivery.`,
        type: 'order',
        link: `/delivery/dashboard`,
      });
    }
  } catch (err) {
    console.warn('[Logistics Notification Notice]:', err.message);
  }
};

/**
 * Create initial Shipment object when an order is created/confirmed
 * Sets warehouse and hub, DOES NOT assign delivery partner!
 */
const createShipmentForOrder = async (order) => {
  try {
    // Generate unique barcode tracking ID
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const shipmentId = `VX-SHP-${Date.now().toString().slice(-6)}-${randomHex}`;

    // Select primary seller if order has multiple items
    let primarySellerId = null;
    let primarySellerName = 'VEXIVO Official Fulfillment';
    let pickupAddr = {
      street: 'Sector 42, Sitapura Central Hub',
      city: 'Jaipur',
      state: 'Rajasthan',
      postalCode: '302022',
      phone: '+91 141 289 9000',
      contactPerson: 'VEXIVO Dispatch Supervisor',
    };

    if (order.items && order.items.length > 0) {
      const firstItemSeller = order.items.find((it) => it.seller);
      if (firstItemSeller && firstItemSeller.seller) {
        primarySellerId = firstItemSeller.seller;
        primarySellerName = firstItemSeller.sellerName || 'Verified Merchant';
        const sellerUser = await User.findById(firstItemSeller.seller).lean();
        if (sellerUser?.sellerProfile?.pickupAddress?.street) {
          pickupAddr = {
            street: sellerUser.sellerProfile.pickupAddress.street,
            city: sellerUser.sellerProfile.pickupAddress.city || 'Jaipur',
            state: sellerUser.sellerProfile.pickupAddress.state || 'Rajasthan',
            postalCode: sellerUser.sellerProfile.pickupAddress.postalCode || '302022',
            phone: sellerUser.sellerProfile.storePhone || sellerUser.phone || '',
            contactPerson: sellerUser.sellerProfile.storeName || sellerUser.name || 'Merchant Manager',
          };
        }
      }
    }

    // Determine nearest/appropriate warehouse based on destination & seller origin
    const warehouse = await selectWarehouseForOrder(order.shippingAddress, pickupAddr);
    // Determine delivery hub under that warehouse
    const deliveryHub = await selectDeliveryHubForOrder(warehouse?._id, order.shippingAddress);

    // Initial OTPs
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const deliveryOtp = order.deliveryDetails?.deliveryOtp || Math.floor(1000 + Math.random() * 9000).toString();

    const shipment = new Shipment({
      shipmentId,
      order: order._id,
      orderNumber: order.orderNumber,
      seller: primarySellerId,
      sellerName: primarySellerName,
      pickupAddress: pickupAddr,
      customer: order.user || null,
      customerName: `${order.shippingAddress.firstName || ''} ${order.shippingAddress.lastName || ''}`.trim() || 'Valued Customer',
      customerPhone: order.shippingAddress.phone || '',
      shippingAddress: {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode,
        country: order.shippingAddress.country || 'India',
      },
      parcelDetails: {
        weight: '1.45 kg',
        dimensions: '30 x 22 x 14 cm',
        boxType: 'Standard Tamper-Evident Corrugated Box',
        itemCount: order.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 1,
        items: (order.items || []).map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          variant: it.variant || '',
          image: it.image || '',
        })),
        declaredValue: order.total,
      },
      warehouse: warehouse?._id || null,
      warehouseName: warehouse?.name || 'VEXIVO Central Warehouse',
      deliveryHub: deliveryHub?._id || null,
      hubName: deliveryHub?.name || 'Local Express Hub',
      pickupOtp,
      deliveryOtp,
      deliveryPartner: null, // STRICT RULE: Never assign delivery partner at order placement!
      deliveryPartnerName: '',
      deliveryPartnerPhone: '',
      currentStage: 'ORDER_CONFIRMED',
      currentLocation: `Merchant Warehouse (${pickupAddr.city})`,
      nextExpectedStep: 'Seller packaging items and scheduling pickup handoff',
      timeline: [
        {
          stage: 'ORDER_PLACED',
          status: 'Order Placed',
          message: 'Customer successfully placed the order on VEXIVO Storefront.',
          location: `${order.shippingAddress.city}, India`,
          facility: 'Online Storefront',
          actor: 'Customer',
          actorRole: 'customer',
          timestamp: new Date(order.createdAt || Date.now()),
        },
        {
          stage: 'ORDER_CONFIRMED',
          status: 'Order Confirmed',
          message: `Order verified and confirmed. Assigned to ${warehouse?.name || 'Regional Fulfillment Center'} for inbound transit.`,
          location: `${pickupAddr.city}, India`,
          facility: warehouse?.name || 'VEXIVO Operations',
          actor: 'VEXIVO Automated Logistics',
          actorRole: 'system',
          timestamp: new Date(),
        },
      ],
    });

    await shipment.save();

    // Link shipment back to Order
    await Order.findByIdAndUpdate(order._id, {
      shipment: shipment._id,
      trackingNumber: shipmentId,
      'deliveryDetails.pickupOtp': pickupOtp,
      'deliveryDetails.deliveryOtp': deliveryOtp,
      'deliveryDetails.deliveryStatus': 'unassigned',
      deliveryPartner: null,
      deliveryPartnerName: '',
      deliveryPartnerPhone: '',
    });

    return shipment;
  } catch (err) {
    console.error('[Create Shipment For Order Error]:', err.message);
    return null;
  }
};

module.exports = {
  seedDefaultWarehousesAndHubs,
  selectWarehouseForOrder,
  selectDeliveryHubForOrder,
  validateStatusTransition,
  mapStageToOrderFields,
  recordTrackingEvent,
  createShipmentForOrder,
  sendLogisticsNotifications,
  ALLOWED_STAGE_TRANSITIONS,
};
