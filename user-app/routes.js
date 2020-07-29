const express = require('express');
const router = express.Router();
const c = require('./controller')

// GET REQUEST
router.get('/', c.signup);
router.get('/login', c.login);
router.get('/leaderboard', c.authToken, c.leaderboard);
router.get('/:username', c.authToken, c.checkUserParams, c.profile);
router.get('/:username/questions', c.authToken, c.checkUserParams, c.allowAdmin, c.user_ques);
router.get('/:username/:que', c.authToken, c.checkUserParams, c.private, c.edit_que);
// router.get('/:username/submit', c.authToken, c.checkUserParams, c.private, c.que_submit);

// POST REQUEST
router.post('/', c.signup);
router.post('/login', c.login);
router.post('/:username/submit', c.authToken, c.checkUserParams, c.private, c.que_submit);

// PUT REQUEST
router.put('/:username/:que', c.authToken, c.checkUserParams, c.private, c.edit_que);

// DELETE REQUEST
router.delete('/:username/:que', c.authToken, c.checkUserParams, c.private, c.edit_que);

module.exports = router;