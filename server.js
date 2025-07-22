const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const saltRounds = 10;
const SECRET_KEY = "your_secret_key_here"; // Replace with a strong secret in production

app.use(bodyParser.json());
app.use(cors());

// MongoDB connection string with your details
const MONGO_URI = "mongodb+srv://dsaikotha:buddi413@cluster0.bvrvik4.mongodb.net/loginDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Define a Mongoose schema and model for users
const userSchema = new mongoose.Schema({
  fullname: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// Signup route
app.post('/signup', async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ success: true, message: 'Account created!' });
  } catch (error) {
    res.json({ success: false, message: 'Error creating account.' });
  }
});

// Login route with JWT generation
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { email: user.email, fullname: user.fullname },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ success: true, token, fullname: user.fullname });
  } catch (error) {
    res.json({ success: false, message: 'Login error.' });
  }
});

// Protected profile route
app.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      res.json({ message: `Welcome ${user.fullname}! This is your profile.` });
    });
  } else {
    res.sendStatus(401);
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});