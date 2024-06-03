const express = require('express');
const {
  sendMessage,
  getMessages,
  getUserConversations,
} = require('../controllers/messageController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/send', authenticateUser, sendMessage);
router.get('/:conversationId', authenticateUser, getMessages);
router.get('/user/conversations', authenticateUser, getUserConversations); // New route

module.exports = router;
