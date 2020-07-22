const express = require('express');
const router = express.Router();

// ALL app Routes URLs
router.use('/api/course', require('../course_app/routes'))

module.exports = router