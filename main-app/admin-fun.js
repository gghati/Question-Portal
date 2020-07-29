const { query } = require('./database');


var value = query('get_users');


console.log(value);

// value.then((result) => {
//     console.log(result);
// });