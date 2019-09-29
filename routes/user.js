const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Helpers = require('../utils/helpers');

router.get('/', function(req, res) {
  let token = req.headers.authorization;
  Helpers.isAdmin(token)
  .then( () => {
    User.getAllUsers((err, users) => {
      if (err) {
        res.json(err);
      } else {
        res.json(users);
      }
    });
  })
  .catch(() => {
    res.status(401).json('Unauthorized');
  });
});

router.post('/admin/:id', (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;

  Helpers.isAdmin(token)
    .then(() => {
      User.getUserById(userId, (err, user) => {
        if (err) {
          res.status(500).json(err);
        } else {
          if (user) {
            user.role = Strings.roles.admin;
            user.save(err => {
              if (err) {
                res.status(500).json(err);
              } else {
                res.json(true);
              }
            });
          } else {
            res.json('enter a valid user id');
          }
        }
      });
    })
    .catch(() => {
      res.status(401).json('Unauthorized');
    });
});

router.get('/:id', (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;

  Helpers.isAdmin(token)
    .then(() => {
      User.getUserById(userId, (err, user) => {
        if (err) {
          res.status(500).json(err);
        } else {
          if (user) {
            res.status(500).json(user);
          } else {
            res.status(404).json('enter a valid user id');
          }
        }
      });
    })
    .catch(() => {
      res.status(401).json('Unauthorized');
    });
});

router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  const token = req.headers.authorization;

  Helpers.isAdmin(token)
    .then(() => {
      User.deleteUserById(userId, (err, deleted) => {
        if (err) {
          res.status(500).json(err);
        } else {
          if (deleted) {
            res.json(true);
          } else {
            res.status(404).json('enter a valid user id');
          }
        }
      });
    })
    .catch(() => {
      res.status(401).json('Unauthorized');
    });
});

module.exports = router;
