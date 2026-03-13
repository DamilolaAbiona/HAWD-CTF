# 🔓 HAWD HackersFriday CTF

> **HackingAPIswithDami** · Week 1 API Security Challenge  
> *find it · break it · own it*

---

## 🎯 What Is This?

This is a **deliberately vulnerable API** built for the HAWD community's HackersFriday weekly CTF challenge. It simulates real-world API vulnerabilities from the **OWASP API Security Top 10**.

**Your mission:** exploit the vulnerabilities, find the flags, earn your points.

---

## ⚡ Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/hawd-ctf.git
cd hawd-ctf
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the server
```bash
npm start
```

The API will be running at **http://localhost:3000**

Open your browser to `http://localhost:3000` to see the challenge UI.

---

## 🧪 Available Credentials

| Username | Password | Role  |
|----------|----------|-------|
| alice    | alice123 | user  |
| bob      | bob456   | user  |
| admin    | admin999 | admin |

---

## 🚩 Challenges

### Challenge 1 — The Order Thief (10 pts)
**Vulnerability:** BOLA (Broken Object Level Authorization)  
**OWASP:** API1:2023

You're logged in as alice. The shop has order records. Can you access an order that doesn't belong to you?

**Steps:**
1. Login as alice → get your JWT token
2. Query your own orders → `GET /api/orders/101`
3. Try accessing other order IDs...
4. Find the flag hidden in one of the orders 👀

---

### Challenge 2 — Read Someone's Mail (10 pts)
**Vulnerability:** BOLA  
**OWASP:** API1:2023

The messages endpoint exposes user messages by userId. You're alice (userId: 1). Can you read messages that belong to other users?

**Steps:**
1. Login as alice
2. Hit `GET /api/messages/1` — your own messages
3. Now try other userIds...
4. Find the flag in the right message

---

### Challenge 3 — Become the Admin (5 pts)
**Vulnerability:** Mass Assignment  
**OWASP:** API6:2023

The profile update endpoint blindly accepts any JSON field. Can you escalate your privileges?

**Steps:**
1. Login as alice
2. Send a PUT request to `/api/users/1/profile`
3. Include an unexpected field in your request body
4. Check the response carefully

**Flag:** `HAWD{m4ss_4ss1gnm3nt_1s_d4ng3r0us}`

---

## 🛠️ Tools You Can Use

- **Burp Suite** — intercept and modify requests
- **Postman** — API testing
- **curl** — command line
- **HTTPie** — beginner-friendly CLI

### Example with curl:
```bash
# Step 1: Login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"alice123"}'

# Step 2: Use your token
curl http://localhost:3000/api/orders/101 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Example with Postman:
1. POST `http://localhost:3000/api/login` with body `{"username":"alice","password":"alice123"}`
2. Copy the token from the response
3. Use it as a Bearer token in subsequent requests

---

## 📚 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/login` | ❌ | Get JWT token |
| GET | `/api/users` | ✅ | List all users |
| GET | `/api/orders/:id` | ✅ | Get order by ID |
| GET | `/api/messages/:userId` | ✅ | Get messages |
| PUT | `/api/users/:id/profile` | ✅ | Update profile |
| GET | `/api/health` | ❌ | Server health |

---

## 🏆 Scoring

| Action | Points |
|--------|--------|
| Find a vulnerability | 10 pts |
| Capture the flag | 10 pts |
| Best exploit write-up | 5 pts |
| Helping a teammate | 3 pts |
| First blood 🩸 | +5 bonus pts |

---

## ⚠️ Disclaimer

This application is **intentionally vulnerable**. Run it **locally only** or in an isolated environment. Never deploy this to a public server.

---

## 🔗 Community

- 🌐 [HackingAPIswithDami](https://hackingapiswith.dami)
- 💬 Join our Slack: Drop your write-ups in `#hackers-friday`
- 🐦 Tag us: **#HackersFriday #HAWD #APISecurity**

---

*Built with ❤️ by the HAWD team · #HackersFriday*
