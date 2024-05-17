const express = require('express');

const ResourcesController = require('../controllers/resources');

const router = express.Router();

router.get('', ResourcesController.getResources);

module.exports = router;