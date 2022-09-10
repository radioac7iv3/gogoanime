/* eslint-disable prettier/prettier */
const express = require('express');
const apiController = require('../Controllers/apiController');

const router = express.Router();

// Init
router.get('/', apiController.home);

// Recent-Release:
router.get('/recent-release', apiController.recentRelease);
// Popular-ongoing
router.get('/popular-ongoing', apiController.popularOngoing);

module.exports = router;
