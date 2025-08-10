const BASE = 'http://localhost:4000/api';



export async function fetchConversations() {
  const r = await fetch(`${BASE}/conversations`);
  return r.json();
}

export async function fetchMessages(phone) {
  const r = await fetch(`${BASE}/conversations/${phone}/messages`);
  return r.json();
}

export async function sendMessage(phone, text) {
  const r = await fetch(`${BASE}/conversations/${phone}/send`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return r.json();
}
