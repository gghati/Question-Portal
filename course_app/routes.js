const express = require('express');
const router = express.Router();
const views = require('./views')

// app.get();
// app.put();
// app.post();
// app.delete();

// parameters and Query parameters
// app.get('/api/:year/:month', (req, res) => {
//     res.send(`year : ${req.params.year}, month: ${req.params.month}, ${req.query.test}`);
// });

router.get('/', views.show_all);
router.get('/:id', views.show_single);
router.post('/', views.add_user);
router.put('/:id', views.update_user);
router.delete('/:id', views.delete_user);

module.exports = router;