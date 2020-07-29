// NOT WORKING FOR NOW

const bcrypt = require('bcrypt');
const { User } = require('../user-app/model');

const USERNAME = 'gauravghati'
const PASSWORD = '1234'

async function save_value(){
    try{
        const end_user = new User({
            username: USERNAME,
            password: await (bcrypt.hash(PASSWORD, 10)),
            numberQue: 0,
            role: 'admin'
        });
        const waiteduser = await end_user.save();
    } catch (err) {
        console.log('error is: ' + err);
    }
}

save_value();