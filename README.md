# WhatsApp Web Clone for webhook

WhatsApp Web–like chat interface that displays WhatsApp conversations using webhook data and support sending new messages.

---

## Live Preview

 https://whatsapp-web-clone.umend.in/


## Tech Stack
### Frontend
- React
- Tailwind CSS
- lucide-react (icons)

### Backend
- Node.js, Express.js
- MongoDB (Mongoose)
- Axios
- dotenv

## Backend


### Backend endpoints
- `POST /api/webhook` — receive WhatsApp webhook JSON(s) and insert/update conversation/messages
- `GET  /api/conversations` — list conversations (server may return only the last message per conversation for the list)
- `GET  /api/conversations/:phone/messages` — return all messages for a conversation
- `POST /api/conversations/:phone/send` — demo send (save an outbound message with `from: "me"`)

### Setup & run (backend)
1. `cd server`
2. `npm install`
3. create `.env`:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/whatsapp
```
4. `npm run dev` or `npm start`
5. To ingest sample payloads: `npm run process`

---

## Frontend


### Setup & run (frontend)
1. `cd client`
2. `npm install`

3. `npm run dev`

---

