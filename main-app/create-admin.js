const { query } = require('./database');
const bcrypt = require('bcrypt');

const USERNAME = 'komalghati'
const PASSWORD = '4321'

data = {
    username: USERNAME,
    password: '',
    role: 'admin'
}

async function changeToHash(password) {
    return await (bcrypt.hash(password, 10));
}

changeToHash(PASSWORD).then((pass) => {
    data.password = pass;
}).catch((err) => {
    console.log('ERROR occur: ' + err);
})

console.log(data.password);
query("insert_user", data);