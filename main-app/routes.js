const express = require('express');
const router = express.Router();

// ALL app Routes URLs
router.use('/admin', require('./admin'))
router.use('/', require('../user-app/routes'));

module.exports = router