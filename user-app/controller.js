require('dotenv').config();

const Joi = require('joi');
var users = require('../json-data').members;
var questions = require('../json-data').questions;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

signup = async (req, res) => {
    // GET POST
    if(req.method === 'GET'){
        res.json(users);
    }
 
    else if (req.method === 'POST') {
        user = users.find(user => user.username === req.body.username.toLowerCase())
        if(user != null) return res.status(404).send('username Already Taken');

        try {
            const hashedpassword = await bcrypt.hash(req.body.password, 10);
            const user = {
                id: users.length + 1,
                username: req.body.username.toLowerCase(),
                password: hashedpassword,
                fullname: req.body.fullname,
                numberQue: 0
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
    // GET  POST
    if(req.method === 'GET'){
        res.json(users);
    } 

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

// WORKING
profile = (req, res) => {
    // => /:username
    console.log('test');
    console.log(req.params.username);
    user = users.filter(user => user.username === req.params.username);
    if(user == null) return res.status(404).send('user not found!');
    res.status(200).json(user);

};

// WORKING
leaderboard = (req, res)  => {
    // => /leaderboard
    if(req.method === 'GET'){
        sorted_users = users;
        sorted_users.sort((b, a) => {return a.numberQue - b.numberQue});
        console.log(sorted_users);
        res.status(200).json(sorted_users);
    }
}

// WORKING
que_submit = (req, res) => {
    // => /:username/submit
    if (req.user.username === req.params.username){
        
        user = users.find(user => user.username === req.user.username);
        if (user==null) return res.send('user not exist').status();
        
        if (req.method === 'GET') 
            return res.json().status(200);

        else if (req.method === 'POST') {
            question = {
                unqid: questions.length + 1,
                queid: user.numberQue + 1,
                heading: req.body.heading,
                statement: req.body.statement,
                opt1: req.body.opt1,
                opt2: req.body.opt2,
                opt3: req.body.opt3,
                opt4: req.body.opt4,
                user: req.user.username,
                rightopt: req.body.rightopt
            }
            user.numberQue += 1;
            questions.push(question);
            res.status(201).json(question);
        }
    } else {
        res.send('You Can only view your Questions').status(400);
    }
}; 

edit_que = (req, res) => {
    // => /:username/:que
    if (req.user.username === req.params.username){
        user = users.find(user => user.username === req.user.username);
        que = questions.filter(que => ((que.queid === req.params.que-1) && (que.user === user.username)))[0];
        console.log(que);
        if (user == null || que == null) return res.status(400).send('que not exist!');

        // WORKING GET POST 
        if (req.method === 'GET')
            res.json(que).status(200);

        else if (req.method === 'PUT') {
            que.heading = req.body.heading;
            que.statement = req.body.statement;
            que.opt1 = req.body.opt1;
            que.opt2 = req.body.opt2;
            que.opt3 = req.body.opt3;
            que.opt4 = req.body.opt4;
            que.rightopt = req.body.rightopt;

            res.json(que).status(200);
        }

        else if (req.method === 'DELETE') {
            // removed_que = questions.slice(que.unqid - 1);
            // res.json(removed_que).status(200);
        }

    } else {
        res.send('You Can only view your Questions').status(400);
    }
};

// WORKING
user_ques = (req, res) => {
    // => /:username/questions
    if (req.user.username === req.params.username){
        user = users.find(user => user.username === req.user.username);
        user_questions = questions.filter(que => que.user === user.username);
        res.json(user_questions).status(200);
    } else {
        res.send('You Can only view your Questions').status(400);
    }
};

// WORKING
authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).send();
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (req.method === 'GET') return res.redirect(301, '/login');
            else if (req.method === 'POST') return res.redirect(307, '/login');
        } 
        req.user = user;
        next();
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
