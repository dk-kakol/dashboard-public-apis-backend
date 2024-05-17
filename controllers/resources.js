const Category = require('../models/category');
const Cors = require('../models/cors');
const Auth = require('../models/auth');
const Permission = require('../models/permission');

exports.getResources = async (req, res, next) => {
  try {
    const categories = await Category.find();
    const cors = await Cors.find();
    const auth = await Auth.find();
    const permissions = await Permission.find();

    res.status(200).json({
      categories: categories.map(cat => ({
        id: cat._id,
        name: cat.name
      })),
      cors: cors.map(cors => ({
        id: cors._id,
        name: cors.name
      })),
      auth: auth.map(auth => ({
        id: auth._id,
        name: auth.name
      })),
      permissions: permissions.map(permission => ({
        id: permission._id,
        name: permission.name,
        description: permission.description
      })),
    })
  } catch(err) {
    res.status(500).json({
      message: err.message
    });
  }
};