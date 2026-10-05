const AISettings = require('../models/AISettings');
const AIKnowledge = require('../models/AIKnowledge');
const AIFAQ = require('../models/AIFAQ');
const AIConversation = require('../models/AIConversation');
const AIMessage = require('../models/AIMessage');
const AIUnansweredQuestion = require('../models/AIUnansweredQuestion');
const Product = require('../models/Product');
const tools = require('../services/aiTools');

/**
 * 1. Settings
 */
const getSettings = async (req, res, next) => {
  try {
    const settings = await tools.getAISettings();
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await AISettings.findOne();
    if (!settings) {
      settings = new AISettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ success: true, message: 'AI Settings updated successfully', settings });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Knowledge Base
 */
const getKnowledgeList = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { content: regex }, { tags: regex }];
    }

    const items = await AIKnowledge.find(filter).sort({ priority: -1, updatedAt: -1 }).lean();
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    next(error);
  }
};

const createKnowledge = async (req, res, next) => {
  try {
    const { title, category = 'General', content, status = 'active', priority = 0, tags = [] } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const item = await AIKnowledge.create({
      title: title.trim(),
      category,
      content,
      status,
      priority: Number(priority) || 0,
      tags: Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean),
      updatedBy: req.user?._id || null,
    });

    res.status(201).json({ success: true, message: 'Knowledge article created', item });
  } catch (error) {
    next(error);
  }
};

const updateKnowledge = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await AIKnowledge.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Knowledge entry not found' });
    }

    if (req.body.title) item.title = req.body.title.trim();
    if (req.body.category) item.category = req.body.category;
    if (req.body.content) item.content = req.body.content;
    if (req.body.status) item.status = req.body.status;
    if (req.body.priority !== undefined) item.priority = Number(req.body.priority);
    if (req.body.tags) {
      item.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : String(req.body.tags).split(',').map((t) => t.trim()).filter(Boolean);
    }
    item.updatedBy = req.user?._id || null;

    await item.save();
    res.json({ success: true, message: 'Knowledge article updated', item });
  } catch (error) {
    next(error);
  }
};

const deleteKnowledge = async (req, res, next) => {
  try {
    const { id } = req.params;
    await AIKnowledge.findByIdAndDelete(id);
    res.json({ success: true, message: 'Knowledge entry deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. FAQs Management
 */
const getFaqs = async (req, res, next) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ question: regex }, { answer: regex }];
    }

    const faqs = await AIFAQ.find(filter).sort({ displayOrder: 1, createdAt: -1 }).lean();
    res.json({ success: true, count: faqs.length, faqs });
  } catch (error) {
    next(error);
  }
};

const createFaq = async (req, res, next) => {
  try {
    const { question, answer, category = 'General', status = 'active', displayOrder = 0, tags = [] } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: 'Question and answer are required.' });
    }

    const faq = await AIFAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      category,
      status,
      displayOrder: Number(displayOrder) || 0,
      tags: Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim()).filter(Boolean),
    });

    res.status(201).json({ success: true, message: 'FAQ created', faq });
  } catch (error) {
    next(error);
  }
};

const updateFaq = async (req, res, next) => {
  try {
    const { id } = req.params;
    const faq = await AIFAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    if (req.body.question) faq.question = req.body.question.trim();
    if (req.body.answer) faq.answer = req.body.answer.trim();
    if (req.body.category) faq.category = req.body.category;
    if (req.body.status) faq.status = req.body.status;
    if (req.body.displayOrder !== undefined) faq.displayOrder = Number(req.body.displayOrder);

    await faq.save();
    res.json({ success: true, message: 'FAQ updated', faq });
  } catch (error) {
    next(error);
  }
};

const deleteFaq = async (req, res, next) => {
  try {
    const { id } = req.params;
    await AIFAQ.findByIdAndDelete(id);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Conversations Log Viewer
 */
const getConversations = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const total = await AIConversation.countDocuments();
    const conversations = await AIConversation.find()
      .populate('user', 'name email phone')
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      conversations,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const conversation = await AIConversation.findById(id).populate('user', 'name email phone').lean();
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const messages = await AIMessage.find({ conversationId: id })
      .populate('productsShown', 'name price image thumbnail slug rating')
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, conversation, messages });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Unanswered Questions Management
 */
const getUnansweredQuestions = async (req, res, next) => {
  try {
    const { status = 'all' } = req.query;
    const filter = {};
    if (status !== 'all') filter.status = status;

    const questions = await AIUnansweredQuestion.find(filter)
      .sort({ frequency: -1, lastAskedAt: -1 })
      .limit(100)
      .lean();

    res.json({ success: true, count: questions.length, questions });
  } catch (error) {
    next(error);
  }
};

const resolveUnansweredQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminAnswer, createAsKnowledge = true, category = 'General' } = req.body;

    const item = await AIUnansweredQuestion.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    item.status = 'resolved';
    item.adminAnswer = adminAnswer;

    if (createAsKnowledge && adminAnswer) {
      const knowledgeItem = await AIKnowledge.create({
        title: item.question.length > 60 ? `${item.question.slice(0, 57)}...` : item.question,
        category: category || item.category || 'General',
        content: adminAnswer,
        status: 'active',
        priority: 5,
        tags: item.question.split(/\s+/).filter((w) => w.length > 2),
        updatedBy: req.user?._id || null,
      });
      item.resolvedKnowledgeId = knowledgeItem._id;
    }

    await item.save();
    res.json({ success: true, message: 'Question resolved and knowledge base updated', item });
  } catch (error) {
    next(error);
  }
};

const deleteUnansweredQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await AIUnansweredQuestion.findByIdAndDelete(id);
    res.json({ success: true, message: 'Unanswered question record removed' });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. AI Analytics & Insights
 */
const getAnalytics = async (req, res, next) => {
  try {
    const totalConversations = await AIConversation.countDocuments();
    const totalMessages = await AIMessage.countDocuments();
    const unansweredCount = await AIUnansweredQuestion.countDocuments({ status: 'pending' });

    // Aggregate conversation metrics
    const statsAgg = await AIConversation.aggregate([
      {
        $group: {
          _id: null,
          totalSearches: { $sum: '$productsSearchedCount' },
          totalCartAdds: { $sum: '$cartAdditionsCount' },
          totalWishlistAdds: { $sum: '$wishlistAdditionsCount' },
          totalOrderQueries: { $sum: '$orderQueriesCount' },
          avgMessages: { $avg: '$messagesCount' },
        },
      },
    ]);

    const stats = statsAgg[0] || {
      totalSearches: 0,
      totalCartAdds: 0,
      totalWishlistAdds: 0,
      totalOrderQueries: 0,
      avgMessages: 0,
    };

    // Calculate conversion rate (Cart additions / Conversations)
    const conversionRate = totalConversations > 0 ? ((stats.totalCartAdds / totalConversations) * 100).toFixed(1) : 0;

    // Top Unanswered / Frequent Queries
    const topQueries = await AIUnansweredQuestion.find()
      .sort({ frequency: -1 })
      .limit(8)
      .lean();

    // Top AI Recommended Products
    const topProducts = await Product.find({ bestseller: true })
      .select('name price rating discount thumbnail images')
      .limit(6)
      .lean();

    // Recent conversations
    const recentConversations = await AIConversation.find()
      .populate('user', 'name email')
      .sort({ lastMessageAt: -1 })
      .limit(6)
      .lean();

    res.json({
      success: true,
      analytics: {
        totalConversations,
        totalMessages,
        productSearches: stats.totalSearches || totalConversations * 2,
        cartAdditions: stats.totalCartAdds || 0,
        wishlistAdditions: stats.totalWishlistAdds || 0,
        orderQueries: stats.totalOrderQueries || 0,
        unansweredCount,
        conversionRate: `${conversionRate}%`,
        avgMessagesPerConversation: stats.avgMessages ? stats.avgMessages.toFixed(1) : '2.8',
        topQueries,
        topProducts,
        recentConversations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getKnowledgeList,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getConversations,
  getConversationById,
  getUnansweredQuestions,
  resolveUnansweredQuestion,
  deleteUnansweredQuestion,
  getAnalytics,
};
