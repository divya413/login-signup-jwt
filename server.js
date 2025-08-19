require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const User = require('./models/User');

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ======= Signup =======
app.post('/signup', async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.json({ success: false, message: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ fullname, email, password: hashed });
    await user.save();

    res.json({ success: true, message: "Account created!" });
  } catch (err) {
    res.json({ success: false, message: "Error creating account." });
  }
});

// ======= Login =======
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, fullname: user.fullname }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token, fullname: user.fullname });
  } catch (err) {
    res.json({ success: false, message: "Login error." });
  }
});

// ======= Protected Profile =======
app.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({ message: `Welcome ${user.fullname}! This is your personal finance tracker.` });
  });
});

// ======= Start Server =======
app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
