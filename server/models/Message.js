const mongoose = require('mongoose');

const MessageSubSchema = new mongoose.Schema({
  id: { type: String, required: true },     
  from: { type: String, required: true }, 
  text: { type: String },
  timestamp: { type: Number, required: true },
  type: { type: String, enum: ['incoming', 'outgoing'] },
  status: { type: String, enum: ['sent', 'delivered', 'read'] }
}, { _id: false });

const ConversationSchema = new mongoose.Schema({
  contact: {
    name: { type: String, required: true },
    phone: { type: String, required: true }
  },
  messages: [MessageSubSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
