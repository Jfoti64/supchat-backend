const express = require('express');
const { sendMessage, getMessages, getMessageById, deleteMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, sendMessage);
router.get('/', authMiddleware, getMessages);
router.get('/:id', authMiddleware, getMessageById);
router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;
