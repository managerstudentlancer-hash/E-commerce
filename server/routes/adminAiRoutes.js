const express = require('express');
const router = express.Router();
const adminAiController = require('../controllers/adminAiController');
const { protect, adminOnly } = require('../middleware/auth');

// All Admin AI endpoints require authentication and admin privileges
router.use(protect, adminOnly);

// Settings
router.get('/settings', adminAiController.getSettings);
router.put('/settings', adminAiController.updateSettings);

// Knowledge Base
router.get('/knowledge', adminAiController.getKnowledgeList);
router.post('/knowledge', adminAiController.createKnowledge);
router.put('/knowledge/:id', adminAiController.updateKnowledge);
router.delete('/knowledge/:id', adminAiController.deleteKnowledge);

// FAQs
router.get('/faqs', adminAiController.getFaqs);
router.post('/faqs', adminAiController.createFaq);
router.put('/faqs/:id', adminAiController.updateFaq);
router.delete('/faqs/:id', adminAiController.deleteFaq);

// Conversations Log
router.get('/conversations', adminAiController.getConversations);
router.get('/conversations/:id', adminAiController.getConversationById);

// Unanswered Questions
router.get('/unanswered', adminAiController.getUnansweredQuestions);
router.post('/unanswered/:id/resolve', adminAiController.resolveUnansweredQuestion);
router.delete('/unanswered/:id', adminAiController.deleteUnansweredQuestion);

// Analytics
router.get('/analytics', adminAiController.getAnalytics);

module.exports = router;
