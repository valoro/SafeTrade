const express = require('express');
const jwt = require('jsonwebtoken');
const dbConnector = require('../utils/dbConnector');
const User = require('../models/user');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('index');
});

router.post('/register', (req, res) => {
  console.log('here')
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json('This email is already registered, login instead?');
    } else {
      res.json(user);
    }
  });
});

router.post('/authenticate', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) {
      return res.json('No user with this email');
    }
    if (!user) {
      return res.json('There is no user with such an email, Register instead?');
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        res.json('Password didnt match');
      }
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), dbConnector.secret, {
          expiresIn: 604800 // 7 days
        });
        return res.json({ token: 'JWT ' + token });
      } else {
        return res.json('Wrong password');
      }
    });
  });
});

module.exports = router;
