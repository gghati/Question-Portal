const express = require('express');
const router = express.Router();
const views = require('./views')

// All methods to the app
router.get('/', views.show_all);
router.get('/:id', views.show_single);
router.post('/', views.add_user);
router.put('/:id', views.update_user);
router.delete('/:id', views.delete_user);

module.exports = router;