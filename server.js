const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const SECRET = "hawd-super-secret-2025";
const FLAG   = "HAWD{b0la_1s_4ll_4b0ut_auth0riz4ti0n_not_4uth3ntic4ti0n}";

// ─── FAKE DATABASE ───────────────────────────────────────────
const users = [
  { id: 1, username: "alice",   password: "alice123",   email: "alice@hawd.io",   role: "user"  },
  { id: 2, username: "bob",     password: "bob456",     role: "user",  email: "bob@hawd.io"    },
  { id: 3, username: "admin",   password: "admin999",   role: "admin", email: "admin@hawd.io"  },
];

const orders = [
  { id: 101, userId: 1, item: "API Security Course", amount: "$49" },
  { id: 102, userId: 2, item: "Pentest Toolkit",     amount: "$99" },
  { id: 103, userId: 3, item: "HAWD Premium",        amount: "$199", flag: FLAG },
];

const messages = [
  { id: 1, userId: 1, content: "Hey Alice, your invoice is attached." },
  { id: 2, userId: 2, content: "Bob, your order has shipped!" },
  { id: 3, userId: 3, content: `Admin note: ${FLAG}` },
];

// ─── MIDDLEWARE ───────────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "No token provided" });

  const token = header.split(" ")[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ─── ROUTES ──────────────────────────────────────────────────

// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: "2h" });
  res.json({ token, message: `Welcome ${user.username}!`, userId: user.id });
});

// GET /api/users — returns all users (mass exposure)
app.get("/api/users", auth, (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

// ─── CHALLENGE 1: BOLA on /api/orders/:id ────────────────────
// Vuln: checks auth but NOT authorization — any logged-in user can access any order
app.get("/api/orders/:id", auth, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found" });

  // 🔴 VULNERABLE: should check order.userId === req.user.id
  res.json(order);
});

// ─── CHALLENGE 2: BOLA on /api/messages/:userId ──────────────
// Vuln: userId is in the URL, no ownership check
app.get("/api/messages/:userId", auth, (req, res) => {
  const msgs = messages.filter(m => m.userId === parseInt(req.params.userId));
  if (!msgs.length) return res.status(404).json({ error: "No messages found" });

  // 🔴 VULNERABLE: req.user.id !== req.params.userId — not checked
  res.json(msgs);
});

// ─── CHALLENGE 3: Mass Assignment ────────────────────────────
// Vuln: accepts any field including 'role' when updating profile
app.put("/api/users/:id/profile", auth, (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });

  // 🔴 VULNERABLE: blindly merges all body fields — attacker can set role: "admin"
  Object.assign(user, req.body);
  res.json({ message: "Profile updated", user: { id: user.id, username: user.username, role: user.role } });
});

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "online", challenge: "HAWD HackersFriday CTF", version: "1.0" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🔓 HAWD CTF API running on http://localhost:${PORT}`);
  console.log(`📖 Read the README to get started\n`);
});
