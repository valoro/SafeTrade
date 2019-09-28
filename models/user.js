const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User_schema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/path/to/gallery/defaultAvatar.png'
  },
  role: {
    type: String,
    default: 'client'
  }
});

const User = mongoose.model('User', User_schema);
module.exports = User;

mongoose.set('useCreateIndex', true);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.deleteUserById = function(id, callback) {
  User.findByIdAndDelete(id, callback);
};

module.exports.getUserByEmail = function(email, callback) {
  const query = { email: email };
  User.findOne(query, callback);
};

module.exports.getUserByUsername = function(username, callback) {
  const query = { username: username };
  User.findOne(query, callback);
};

module.exports.getAllUsers = function(callback) {
  User.find({}, callback);
};

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      if (err) {
        throw err;
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) {
      throw err;
    }
    callback(null, isMatch);
  });
};
