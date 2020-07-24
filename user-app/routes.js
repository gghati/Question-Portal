const express = require('express');
const router = express.Router();
const controller = require('./controller')

// GET REQUEST
router.get('/', controller.signup);
router.get('/login', controller.login);
router.get('/leaderboard', controller.authenticateToken, controller.leaderboard);
router.get('/:username', controller.authenticateToken, controller.profile);
router.get('/:username/submit', controller.authenticateToken, controller.que_submit);
router.get('/:username/questions', controller.authenticateToken, controller.user_ques);
router.get('/:username/:que', controller.authenticateToken, controller.edit_que);

// POST REQUEST
router.post('/', controller.signup);
router.post('/login', controller.login);
router.post('/:username/submit', controller.authenticateToken, controller.que_submit);

// PUT REQUEST
router.put('/:username/:que', controller.authenticateToken, controller.edit_que);

// DELETE REQUEST
router.delete('/:username/:que', controller.authenticateToken, controller.edit_que);

module.exports = router;