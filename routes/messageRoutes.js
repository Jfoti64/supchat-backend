const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

router.post('/send', authenticateUser, sendMessage);
router.get('/:conversationId', authenticateUser, getMessages);

module.exports = router;
