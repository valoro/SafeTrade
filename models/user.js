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
  subscription: {
    type: String,
    default: 'free',
    enum: ['free', 'pro']
  },
  networks: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Network'
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

module.exports.getUserNetworkByName = function(
  userId,
  networkName,
  resolve,
  reject
) {
  User.findById({ _id: userId })
    .populate({
      path: 'networks',
      model: 'Network',
      populate: {
        path: 'instantiatedContracts',
        model: 'InstantiatedContract',
        populate: {
          path: 'assetObjects',
          model: 'AssetObject',
          populate: {
            path: 'properties',
            model: 'AssetProperty'
          }
        }
      }
    })
    .exec((err, user) => {
      if (err) {
        return reject(err);
      }
      for (let i = 0; i < user.networks.length; i++) {
        if (user.networks[i].name === networkName) {
          return resolve(user.networks[i]);
        }
      }
      return reject(
        new Error(`no network ${networkName} found for user ${userId}`).message
      );
    });
};

module.exports.asyncRemoveNetwork = function(userId, networkId) {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { networks: networkId } },
      { new: true },
      (err, user) => {
        if (err) {
          return reject(err);
        }
        return resolve(user);
      }
    );
  });
};
