const express = require('express');
const router = express.Router();
const c = require('./controller')

// ADMIN SESSION
router.get('/admin', c.authToken, c.onlyAdmin, c.adminQue);
router.get('/admin/:lower/:upper', c.authToken, c.onlyAdmin, c.rangeQue);
router.get('/admin/:queid', c.authToken, c.onlyAdmin, c.partQue);
router.put('/admin/:queid', c.authToken, c.onlyAdmin, c.partQue);

// GET REQUEST
router.get('/', c.signup);
router.get('/login', c.login);
router.get('/leaderboard', c.authToken, c.leaderboard);
router.get('/:username', c.authToken, c.checkUserParams, c.profile);
router.get('/:username/questions', c.authToken, c.checkUserParams, c.allowAdmin, c.user_ques);
router.get('/:username/:que', c.authToken, c.checkUserParams, c.private, c.edit_que);

// POST REQUEST
router.post('/', c.signup);
router.post('/login', c.login);
router.post('/:username/submit', c.authToken, c.private, c.checkUserParams, c.que_submit);

// PUT REQUEST
router.put('/:username/:que', c.authToken, c.private, c.checkUserParams, c.edit_que);

// DELETE REQUEST
router.delete('/:username/:que', c.authToken, c.private, c.checkUserParams, c.edit_que);

module.exports = router;

// private -> compare url user with authenticated user, only he can access
// allowAdmin -> compare url name with authenticated user and admin users
// authToken -> Compare JWT token and authenticate user
// checkUserParams -> check url username exists or not