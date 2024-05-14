const ApiEntry = require('../models/apiEntries');

exports.getApiEntries = (req, res, next) => {
  ApiEntry.find()
    .then(documents => {
      res.status(200).json({
        count: documents.length,
        entries: documents,
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching entries failed!"
      });
    });
};