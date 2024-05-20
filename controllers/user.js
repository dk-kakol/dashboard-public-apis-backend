const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const mapUser = (user) => ({
  id: user?._id,
  email: user?.email,
  active: user?.active,
  addApisLimit: user?.addApisLimit,
  permissions: user?.permissions,
  imagePath: user?.imagePath
});

exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hash
    });
    let imagePath;
    if (req.file) {
      const url = await (req.protocol + "://" + req.get("host"))
      imagePath = `${url}/${process.env.PATH_IMAGES_DASHBOARD_PUBLIC_APIS}/${req.file.filename}`;
      user.imagePath = imagePath;
      await user.save();
    }
    res.status(201).json({
      user: mapUser(user)
    });
  }
  catch(err) {
    res.status(500).json({
      message: err.message
    });
  }
}

exports.userLogin = async (req, res, next) => {
  try {
    const fetchedUser = await User.findOne({ email: req.body.email });
    if (!fetchedUser) {
      return res.status(401).json({
        message: 'Auth failed',
      });
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, fetchedUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
    const token = await jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      user: mapUser(fetchedUser)
    });
  } catch(err) {
    res.status(401).json({
      message: err.message
    });
  };
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      user.password = hash;
    }
    if (req.body.active) {
      if (req.body.active === 'true') {
        user.active = true;
      } 
      else if (req.body.active === 'false') {
        user.active = false;
      } 
      else {
        user.active = req.body.active;
      }
    }
    if (req.body.addApisLimit) {
      typeof req.body.addApisLimit === 'string'
        ? user.addApisLimit = Number(req.body.addApisLimit)
        : user.addApisLimit = req.body.addApisLimit
    }
    if (req.body.permissions) {
      user.permissions = req.body.permissions;
    }
    if (req.file) {
      const url = await (req.protocol + "://" + req.get("host"))
      imagePath = `${url}/${process.env.PATH_IMAGES_DASHBOARD_PUBLIC_APIS}/${req.file.filename}`;
      user.imagePath = imagePath;
    }
    await user.save();

    res.status(200).json({
      user: mapUser(user)
    })
  } catch(err) {
    res.status(500).json({
      message: err.message
    })
  }
}

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const mappedUsers = users.map(user => mapUser(user));
    res.status(200).json({
      users: mappedUsers
    })
  } catch(err) {
    res.status(500).json({
      message: err.message
    })
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    user
    ? res.status(200).json({
        user: mapUser(user)
      })
    : res.status(404).json({
      message: 'User not found'
    })
  } catch(err) {
    res.status(500).json({
      message: err.message
    })
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.userData.userId) {
      return res.status(403).json({
        message: 'Forbidden: You cannot delete your own account'
      })
    }
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: 'User deleted!'
    })
  } catch(err) {
    res.status(500).json({
      message: err.message
    })
  }
}
