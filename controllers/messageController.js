const asyncHandler = require('express-async-handler');
const Message = require('../models/message');
const Conversation = require('../models/conversation');

// Send a message
exports.sendMessage = asyncHandler(async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  // Check if a conversation already exists between the sender and receiver
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
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

  // Update the last message in the conversation
  conversation.lastMessage = message._id;
  await conversation.save();

  res.status(201).json(message);
});

// Get messages in a conversation
exports.getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.find({ conversationId })
    .sort({ timestamp: 1 })
    .populate('senderId', 'username');

  res.status(200).json(messages);
});

// Get user conversations
exports.getUserConversations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const conversations = await Conversation.find({ participants: userId })
    .populate('lastMessage')
    .populate('participants', 'username');

  if (!conversations) {
    return res.status(404).json({ message: 'No conversations found' });
  }

  res.status(200).json(conversations);
});

// Create new conversation
exports.createConversation = asyncHandler(async (req, res) => {
  const { userId, participantId } = req.body; // Get userId and participantId from the request body

  // Check if a conversation already exists between the user and participant
  let conversation = await Conversation.findOne({
    participants: { $all: [userId, participantId] },
  });

  if (!conversation) {
    conversation = new Conversation({
      participants: [userId, participantId],
    });
    await conversation.save();
  }

  res.status(201).json(conversation);
});
