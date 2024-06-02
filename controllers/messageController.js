const asyncHandler = require('express-async-handler');
const Message = require('../models/message');
const Conversation = require('../models/conversation');

// Send a message
exports.sendMessage = asyncHandler(async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  // Check if a conversation already exists between the sender and receiver
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] }
  });

  // If no conversation exists, create a new one
  if (!conversation) {
    conversation = new Conversation({
      participants: [senderId, receiverId],
    });
    await conversation.save();
  }

  const message = new Message({
    conversationId: conversation._id,
    senderId,
    receiverId,
    content,
  });

  await message.save();

  res.status(201).json(message);
});

// Get messages in a conversation
exports.getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });

  res.status(200).json(messages);
});
