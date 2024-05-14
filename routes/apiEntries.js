const express = require("express");

const ApiEntryController = require('../controllers/apiEntries');

const router = express.Router();

router.get("", ApiEntryController.getApiEntries);

module.exports = router;