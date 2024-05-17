const User = require('../models/user');

module.exports = (permission) => {
  return async (req, res, next) => {
    const user = await User.findOne({ _id: req.userData.userId }).populate('permissions');
    const userPermissions = await user.permissions.map(permission => permission.name);
    const isPermitted = await (userPermissions && userPermissions.includes(permission));
    
    isPermitted
      ? next()
      : res.status(403).json({ message: "Forbidden: you don't have access rights!" });
  }
}
