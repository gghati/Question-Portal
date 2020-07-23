require('dotenv').config();

const Joi = require('joi');
var users = require('../json-data');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

signup = async (req, res) => {
    // GET
    if(req.method === 'GET'){
        res.json(users);
    }

    // POST
    else if (req.method === 'POST') {
        try {
            const hashedpassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                id: users.length + 1,
                username: req.body.username,
                password: hashedpassword
            }
            users.push(user);
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({accessToken: accessToken}).status(201);
        } catch {
            res.status(500).send();
        }
    }
};

login = async (req, res) => {
    
    // GET
    if(req.method === 'GET'){
        res.render(users);
    } 
    
    // POST
    else if (req.method === 'POST') {
        const user = users.find(user => user.username === req.body.username)
        if(user == null) {
            return res.send('User Not Found').status(400)
        }

        try {
            if (await bcrypt.compare(req.body.password, user.password)){
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                res.json({accessToken: accessToken});
            } else {
                res.send('Password Wrong!')
            }
        } catch {
            res.status(500).send();
        }
    }
};

profile = (req, res) => {
    
}

leaderboard = (req, res)  => {

};

que_submit = (req, res) => {

};

edit_que = (req, res) => {
    res.json(users.find(user => user.username === req.user.username));
    console.log(req.user.username);
};

user_ques = (red, res) => {

};

authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).send();
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next()
    });
};

module.exports = {
    login,
    signup,
    profile,
    leaderboard,
    que_submit,
    user_ques,
    edit_que,
    authenticateToken
};
