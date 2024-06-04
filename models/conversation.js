// models/conversation.js
const mongoose = require('mongoose');
const Message = require('./message');

const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  created_at: { type: Date, default: Date.now },
});

// Middleware to delete all related messages when a conversation is deleted
ConversationSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await Message.deleteMany({ conversationId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
