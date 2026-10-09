const User = require('../models/User');

const initDeliveryPartner = async () => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  try {
    const existing = await User.findOne({ email: 'delivery@vexivo.com' });
    if (!existing) {
      await User.create({
        name: 'Vikram Singh (Express Delivery)',
        email: 'delivery@vexivo.com',
        passwordHash: 'DeliveryPass123!',
        role: 'delivery_partner',
        phone: '+919876543219',
        deliveryProfile: {
          status: 'ACTIVE',
          vehicleType: 'Electric 2-Wheeler (Ather 450X)',
          vehicleNumber: 'RJ-14-EA-9921',
          licenseNumber: 'DL-RJ14-2022-004921',
          isOnline: true,
          isApproved: true,
          city: 'Jaipur',
          serviceZones: ['Mansarovar', 'Sitapura', 'Malviya Nagar', 'Jaipur Central', 'Vaishali Nagar'],
          rating: 4.95,
          totalDeliveries: 128,
          earnings: 6400,
          kycStatus: 'verified',
        },
      });
      console.log('🛵 [VEXIVO Delivery] Seeded default Delivery Partner: delivery@vexivo.com | DeliveryPass123!');
    } else {
      if (!existing.deliveryProfile) existing.deliveryProfile = {};
      existing.deliveryProfile.status = 'ACTIVE';
      existing.deliveryProfile.isApproved = true;
      await existing.save();
    }
  } catch (err) {
    console.warn('[VEXIVO Delivery] Partner init warning:', err.message);
  }
};

module.exports = initDeliveryPartner;
