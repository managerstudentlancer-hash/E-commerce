const Coupon = require('../models/Coupon');

// @desc Validate coupon code
// @route POST /api/coupons/validate
const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (subtotal < coupon.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of £${coupon.minimumOrder.toFixed(2)} required for this coupon`,
      });
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = Math.min(coupon.value, subtotal);
    }

    discount = Math.round(discount * 100) / 100;

    res.json({
      success: true,
      valid: true,
      code: coupon.code,
      discount,
      type: coupon.type,
      value: coupon.value,
      message: `Coupon '${coupon.code}' applied successfully! Saved £${discount.toFixed(2)}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all coupons (Admin)
// @route GET /api/coupons
const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc Create coupon (Admin)
// @route POST /api/coupons
const createCoupon = async (req, res, next) => {
  try {
    const { code, type, value, minimumOrder, maximumDiscount, expiryDate, usageLimit, active } = req.body;

    const exists = await Coupon.findOne({ code: code.toUpperCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type: type || 'percentage',
      value: Number(value),
      minimumOrder: Number(minimumOrder || 0),
      maximumDiscount: Number(maximumDiscount || 0),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      usageLimit: Number(usageLimit || 1000),
      active: active !== undefined ? active : true,
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

// @desc Delete coupon (Admin)
// @route DELETE /api/coupons/:id
const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon,
};
