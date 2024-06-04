// routes/messageRoutes.js
const express = require('express');
const {
  sendMessage,
  getMessages,
  getUserConversations,
  createConversation,
  deleteConversation,
} = require('../controllers/messageController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/send', authenticateUser, sendMessage);
router.get('/:conversationId', authenticateUser, getMessages);
router.get('/user/conversations', authenticateUser, getUserConversations);
router.post('/user/conversations', authenticateUser, createConversation);
router.delete('/:conversationId', authenticateUser, deleteConversation);

module.exports = router;
