const mongoose = require('mongoose');

const aiSettingsSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    assistantName: { type: String, default: 'VEXIVO AI Customer Care', trim: true },
    avatarUrl: { type: String, default: '' },
    welcomeMessage: {
      type: String,
      default:
        "Hi Member! 👋 I’m your **VEXIVO AI Customer Care Assistant**.\n\nI’m available 24×7 to help with orders, returns, refunds, payments, delivery, products, offers and shopping.\n\nHow can I help you today?",
    },
    fallbackMessage: {
      type: String,
      default:
        "I couldn't find an exact match for that in our catalog, but I'm here 24×7 to assist you with orders, returns, payments, or product recommendations!",
    },
    suggestedQuestions: {
      type: [String],
      default: [
        '📦 Track My Order',
        '↩️ Return My Order',
        '💳 Payment Help',
        '🛍️ Find Products',
        '🎁 Offers & Coupons',
        '✨ Talk About Shopping',
      ],
    },
    productResultLimit: { type: Number, default: 6, min: 1, max: 20 },
    languagePreference: {
      type: String,
      enum: ['multi', 'english', 'hindi', 'hinglish'],
      default: 'multi',
    },
    temperature: { type: Number, default: 0.3, min: 0, max: 1 },
    maxTokens: { type: Number, default: 1000 },
    systemPrompt: {
      type: String,
      default:
        "You are VEXIVO AI Customer Care, the official 24x7 unified Customer Care and Shopping AI of VEXIVO. You handle complete customer support (order tracking, cancellations, returns, refunds, payments, delivery, account, and policies) as well as shopping assistance (product discovery, budget search, sizes, colors, variants, stock, and offers). You must use VEXIVO's connected backend database as the single source of truth. Never invent products, prices, discounts, stock, sizes, colors, orders, or policies. Understand English, Hindi and Hinglish. Be friendly, empathetic, concise, helpful and premium.",
    },
    enableOrderActions: { type: Boolean, default: true },
    enableCartActions: { type: Boolean, default: true },
    enableWishlistActions: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.AISettings || mongoose.model('AISettings', aiSettingsSchema);
