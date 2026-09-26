const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  fullName: { type: String, default: '' },
  phone: { type: String, default: '' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: '' },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  landmark: { type: String, default: '' },
  addressType: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    gender: { type: String, enum: ['', 'male', 'female', 'other', 'prefer_not_to_say'], default: '' },
    dateOfBirth: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
    isSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    sellerProfile: {
      storeName: { type: String, default: '' },
      legalBusinessName: { type: String, default: '' },
      businessType: { type: String, default: 'Individual / Sole Proprietor' },
      gstin: { type: String, default: '' },
      panNumber: { type: String, default: '' },
      storeEmail: { type: String, default: '' },
      storePhone: { type: String, default: '' },
      storeDescription: { type: String, default: '' },
      storeAddress: { type: String, default: '' },
      pickupAddress: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        postalCode: { type: String, default: '' },
        country: { type: String, default: 'India' },
      },
      bankDetails: {
        accountHolderName: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        bankName: { type: String, default: '' },
        ifscCode: { type: String, default: '' },
        accountType: { type: String, default: 'Current' },
      },
      categories: [{ type: String }],
      storeRating: { type: Number, default: 5.0 },
      isApproved: { type: Boolean, default: true },
      registeredAt: { type: Date, default: Date.now },
    },
    rewardPoints: { type: Number, default: 100 },
    rewardsHistory: [
      {
        points: { type: Number, required: true },
        type: { type: String, enum: ['earned', 'redeemed'], required: true },
        description: { type: String, default: '' },
        date: { type: Date, default: Date.now },
      },
    ],
    otpCode: { type: String, default: '' },
    otpExpiresAt: { type: Date, default: null },
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
