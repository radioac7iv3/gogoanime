/* eslint-disable prettier/prettier */
const express = require('express');
const apiController = require('../Controllers/apiController');

const router = express.Router();

// Init
router.get('/', apiController.home);

module.exports = router;
