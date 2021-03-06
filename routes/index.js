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
  let role = req.body.role;
  if(role !== 'financialManager' && role !== 'technicalManager' && role !== 'client'){
    return res.status(500).json('please enter a valid role')
  }
  const newUser = new User({
    mobile: req.body.mobile,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: role
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.status(500).json('This email is already registered, login instead?');
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
      return res.status(500).json(err);
    }
    if (!user) {
      return res.status(404).json('There is no user with such an email, Register instead?');
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        res.status(500).json('Password didnt match');
      }
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), dbConnector.secret, {
          expiresIn: 604800 // 7 days
        });
        return res.json({ token: 'JWT ' + token , role: user.role});
      } else {
        return res.status(500).json('Wrong password');
      }
    });
  });
});

module.exports = router;
