const express = require('express');

const ApiEntryController = require('../controllers/apiEntries');

const checkAuth = require('../middleware/check-auth');
const checkPermission = require('../middleware/check-permission');

const router = express.Router();

router.get('', ApiEntryController.getApiEntries);

router.get('/to-verify', checkAuth, checkPermission('manageApiEntry'), ApiEntryController.getApiEntriesToVerify);

router.post('/add', checkAuth, checkPermission('addApiEntry'), ApiEntryController.createApiEntry );

router.delete('/delete/:id', checkAuth, checkPermission('manageApiEntry'), ApiEntryController.deleteApiEntry );

router.put('/approve/:id', checkAuth, checkPermission('manageApiEntry'), ApiEntryController.approveApiEntry );

module.exports = router;