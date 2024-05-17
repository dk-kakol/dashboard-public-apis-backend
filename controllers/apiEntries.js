const ApiEntry = require('../models/apiEntries');
const User = require('../models/user');

const mapApiEntry = (apiEntryDoc) => ({
  id: apiEntryDoc?._id,
  API: apiEntryDoc?.API,
  Description: apiEntryDoc?.Description,
  Auth: apiEntryDoc?.Auth?.name,
  HTTPS: apiEntryDoc?.HTTPS,
  Cors: apiEntryDoc?.Cors?.name,
  Link: apiEntryDoc?.Link,
  Category: apiEntryDoc?.Category?.name,
})

exports.getApiEntries = async (req, res, next) => {
  try {
    const apiEntries = await ApiEntry.find({ ApiApproved: true })
      .populate('Auth')
      .populate('Category')
      .populate('Cors');
    res.status(200).json({
      count: apiEntries.length,
      entries: apiEntries.map(apiEntry => mapApiEntry(apiEntry))
    })

  } catch(error) {
      res.status(500).json({
        message: error.message
      });
  };
};

exports.getApiEntriesToVerify = async (req, res, next) => {
  try {
    const apiEntries = await ApiEntry.find({ ApiApproved: false })
      .populate('Auth')
      .populate('Category')
      .populate('Cors');
    res.status(200).json({
      count: apiEntries.length,
      entries: apiEntries.map(apiEntry => mapApiEntry(apiEntry))
    })

  } catch(error) {
      res.status(500).json({
        message: error.message
      });
  };
};

exports.createApiEntry = async (req, res, next) => {
  try {
    const creator = await User.findById(req.userData.userId);
    if (creator.addApisLimit < 1) {
      return res.status(403).json({
        message: 'Forbidden: User reached the limit of apiEntry addition'
      })
    }
    const apiEntry = await ApiEntry.create({
      API: req.body?.API,
      Description: req.body?.Description,
      Auth: req.body?.Auth,
      HTTPS: req.body?.HTTPS,
      Cors: req.body?.Cors,
      Link: req.body?.Link,
      Category: req.body?.Category,
      Creator: req.userData.userId,
    });
    const populatedApiEntry = await ApiEntry.findOne(apiEntry)
      .populate('Auth')
      .populate('Category')
      .populate('Cors');

    creator.addApisLimit -= 1;
    await creator.save();

    res.status(201).json({
      apiEntry: mapApiEntry(populatedApiEntry)
    })
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.deleteApiEntry = async (req, res, next) => {
  try {
    await ApiEntry.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: 'ApiEntry deleted!'
    })
  } catch(err) {
    res.status(500).json({
      message: err.message
    })
  }
};

exports.approveApiEntry = async (req, res, next) => {
// case delete usera po utworzeniu:
// - spr: czy mogę usunąć usera jak ma utworzone apiEntry, po usunięciu sprawdzić pozostałe requesty związane z jego apiEntry
try {
  const apiEntry = await ApiEntry.findById(req.params.id);
  if (!apiEntry) {
    return res.status(404).json({
      message: 'ApiEntry not found'
    })
  }
  apiEntry.ApiApproved = true;
  await apiEntry.save();
  const apiEntryCreator = await User.findById(apiEntry.Creator);
  if (apiEntryCreator) {
    apiEntryCreator.addApisLimit +=1;
    apiEntryCreator.save();
  }
  const apiEntries = await ApiEntry.find({ ApiApproved: false })
      .populate('Auth')
      .populate('Category')
      .populate('Cors');
  res.status(200).json({
    count: apiEntries.length,
    entries: apiEntries.map(apiEntry => mapApiEntry(apiEntry))
  })
} catch(err) {
  res.status(500).json({
    message: err.message
  })
}
};