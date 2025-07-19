const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Datastore = require('nedb');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = new Datastore({ filename: 'users.db', autoload: true });

// Signup route
app.post('/signup', (req, res) => {
  const { fullname, email, password } = req.body;

  db.findOne({ email }, (err, user) => {
    if (user) {
      res.json({ success: false, message: 'Email already registered.' });
    } else {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          res.json({ success: false, message: 'Error hashing password.' });
          return;
        }
        db.insert({ fullname, email, password: hash }, (err, newUser) => {
          res.json({ success: true, message: 'Account created!' });
        });
      });
    }
  });
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.findOne({ email }, (err, user) => {
    if (!user) {
      res.json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        res.json({ success: true, fullname: user.fullname });
      } else {
        res.json({ success: false, message: 'Invalid credentials.' });
      }
    });
  });
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
