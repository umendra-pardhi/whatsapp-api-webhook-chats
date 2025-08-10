const express = require('express');
const router = express.Router();
const Conversation = require('../models/Message');

router.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;
    const entry = payload.metaData?.entry || payload.entry;
    if (!entry) return res.status(400).send('bad payload');

    for (const e of entry) {
      const changes = e.changes || [];
      for (const ch of changes) {
        const value = ch.value || {};

        // Handle incoming/outgoing messages
        if (value.messages && Array.isArray(value.messages)) {
          const contact = value.contacts?.[0] || {};
          const contactName = contact.profile?.name || '';
          const wa_id = contact.wa_id;
          const businessNumber = value.metadata?.display_phone_number;

          for (const m of value.messages) {
            const isOutbound = (m.from === businessNumber);
            const type = isOutbound ? 'outgoing' : 'incoming';

            await Conversation.updateOne(
              { 'contact.phone': wa_id },
              {
                $setOnInsert: {
                  contact: { name: contactName, phone: wa_id }
                },
                $push: {
                  messages: {
                    id: m.id,
                    from: isOutbound ? 'me' : wa_id,
                    text: m.text?.body || '',
                    timestamp: Number(m.timestamp),
                    type,
                    status: isOutbound ? 'sent' : undefined
                  }
                }
              },
              { upsert: true }
            );
          }
        }

        // Handle status updates
        if (value.statuses && Array.isArray(value.statuses)) {
          for (const s of value.statuses) {
            await Conversation.updateOne(
              { 'messages.id': s.id },
              { $set: { 'messages.$.status': s.status } }
            );
          }
        }
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/conversations', async (req, res) => {
  const convos = await Conversation.find({}, { messages: { $slice: -1 } })
    .sort({ 'messages.timestamp': -1 })
    .lean();
  res.json(convos);
});


router.get('/conversations/:phone/messages', async (req, res) => {
  const convo = await Conversation.findOne({ 'contact.phone': req.params.phone }).lean();
  res.json(convo ? convo.messages : []);
});


router.post('/conversations/:phone/send', async (req, res) => {
  const { text } = req.body;
  const phone = req.params.phone;

  const convo = await Conversation.findOne({ 'contact.phone': phone });
  if (!convo) return res.status(404).json({ error: 'Conversation not found' });

  const newMsg = {
    id: 'local-' + Date.now(),
    from: 'me',
    text,
    timestamp: Math.floor(Date.now() / 1000),
    type: 'outgoing',
    status: 'sent'
  };

  convo.messages.push(newMsg);
  await convo.save();
  res.json(newMsg);
});



module.exports = router;
