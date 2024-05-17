const express = require('express');

const UserController = require('../controllers/user');

const checkAuth = require('../middleware/check-auth');
const checkPermission = require('../middleware/check-permission');
const extractFile = require("../middleware/file");

const router = express.Router();

router.post('/signup', extractFile('userImage'), UserController.createUser);

router.post('/login', UserController.userLogin);

router.put('/update/:id', checkAuth, extractFile('userImage'), UserController.updateUser);

router.get('/get-all', checkAuth, checkPermission('manageUsers'), UserController.getUsers);

router.get('/get-user/:id', checkAuth, checkPermission('manageUsers'), UserController.getUser);

router.delete('/:id', checkAuth, checkPermission('manageUsers'), UserController.deleteUser);

module.exports = router;