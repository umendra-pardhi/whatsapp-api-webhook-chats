const axios = require('axios');
const fs = require('fs');
const path = require('path');

const SERVER = process.env.SERVER_URL || 'http://localhost:4000';

const files = [
  'conversation_1_message_1.json',
  'conversation_1_message_2.json',
  'conversation_1_status_2.json',
  'conversation_2_message_1.json',
  'conversation_2_message_2.json',
  'conversation_2_status_1.json',
  'conversation_2_status_2.json'
].map(f => path.join(__dirname, f))
 .filter(f => fs.existsSync(f));

(async ()=> {
  for (const f of files) {
    const payload = JSON.parse(fs.readFileSync(f, 'utf8'));
    console.log('POST', path.basename(f));
    try {
      const r = await axios.post(`${SERVER}/api/webhook`, payload);
      console.log('->', r.data);
    } catch (e) {
      console.error('ERR', e.message);
    }
  }
})();
