const ApiEntry = require('../models/apiEntries');
const Cors = require('../models/cors');
const Auth = require('../models/auth');
const Permission = require('../models/permission');
const User = require('../models/user');
const Category = require('../models/category');

const resourcePermissions = require('../resources/permissions');
const resourceCors = require('../resources/cors');
const resourceAuth = require('../resources/auth');
const resourceApiEntries = require('../resources/apiEntries');
const resourceCategory = require('../resources/category');

async function init(db) {
  console.log('init');
  await db.connection.dropDatabase();

  const permissions = await Permission.insertMany(resourcePermissions);
  const permissionsId = await permissions.map(permission => permission._id);

  const user = await User.create({
    email: process.env.npm_config_email,
    password: process.env.npm_config_password,
    permissions: permissionsId,
  })

  await Cors.insertMany(resourceCors);

  await Auth.insertMany(resourceAuth);

  await Category.insertMany(resourceCategory.map(name => ({ name })));

  const resourceEntries = await Promise.all(resourceApiEntries.entries.map(async (entry) => {
    const cors = await Cors.findOne({ name: entry.Cors });
    const auth = await Auth.findOne({ name: entry.Auth });
    const category = await Category.findOne({ name: entry.Category});

    return {
      ...entry,
      Cors: cors._id,
      Auth: auth._id,
      Category: category._id,
      Creator: user._id,
      ApiVerified: true,
    }
  }));
  const apiEntries = await ApiEntry.insertMany(resourceEntries);

  // const apiEntriesPopulated  = await ApiEntry.find()
  //   .populate('Cors')
  //   .populate('Auth')
  //   .populate('Creator')
  //   .populate('Category')
  //   .exec();
  // console.log(apiEntriesPopulated);

  // const category = await ApiEntry.distinct('Category').exec();
  // console.log(category);

}

module.exports = init;