require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Question } = require('./model');

const ROLE = {
    BASIC: 'basic',
    ADMIN: 'admin'
};

// WORKING
signup = async (req, res) => {
    // GET POST
    if(req.method === 'GET'){
        try {
            const users = await User.find()
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    else if (req.method === 'POST') {
        try {
            const users = await User.find()
            const user = users.find(user => user.username === req.body.username)
            if(user != null) return res.status(404).json({message: 'username Already Taken'});

            var role = null;
            if (req.body.role === undefined) role = ROLE.BASIC; else role = ROLE.ADMIN;

            const hashedpassword = await bcrypt.hash(req.body.password, 10);

            const new_user = new User({
                username: req.body.username.toLowerCase(),
                password: hashedpassword,
                numberQue: 0,
                role: role
            });
            
            const waiteduser = await new_user.save();

            const accessToken = jwt.sign(waiteduser.toJSON(), process.env.ACCESS_TOKEN_SECRET);
            res.json({accessToken: accessToken}).status(201);
        } catch (err) {
            res.status(400).json({ message: `post internal error: ${err}` });
        }
    }
};

// WORKING
login = async (req, res) => {
    // GET  POST
    const users = await User.find()
    if(req.method === 'GET'){
        try {
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    } 

    else if (req.method === 'POST') {
        const user = users.find(user => user.username === req.body.username)
        if(user == null) {
            return res.json({ message: 'User Not Found'}).status(400)
        }

        try {
            if (await bcrypt.compare(req.body.password, user.password)){
                const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
                res.json({accessToken: accessToken});
            } else {
                res.json({ message: 'Password Wrong!'})
            }
        } catch (err) {
            res.status(500).json({message: `Internal error ${err}`});
        }
    }
};

// WORKING
profile = async (req, res) => {
    // => /:username
    res.status(200).json(req.params_user);
};

// WORKING
leaderboard = async (req, res)  => {
    // => /leaderboard
    if(req.method === 'GET'){
        try {
            const users = await User.find()
            users.sort((b, a) => {return a.numberQue - b.numberQue});
            console.log(users);
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({message: err});
        }
    }
}


que_submit = async (req, res) => {
    // => /:username/submit
    try{
        if (req.method === 'POST') {
            question = new Question({
                queid: req.params_user.numberQue + 1,
                heading: req.body.heading,
                statement: req.body.statement,
                opt1: req.body.opt1,
                opt2: req.body.opt2,
                opt3: req.body.opt3,
                opt4: req.body.opt4,
                user: req.user.username,
                rightopt: req.body.rightopt
            });
            req.user.numberQue += 1;
            req.user.save()
            const waited_que = await question.save();
            
            res.status(201).json(waited_que);
        }
    } catch (err) {
        console.log(`Error ${err}`);
    }
}; 

edit_que = async (req, res) => {
    // => /:username/:que
    que = questions.filter(que => ((que.queid === req.params.que-1) && (que.user === req.user.username)))[0];
    console.log(que);
    if (user == null || que == null) return res.status(400).json({ message: 'que not exist!'});

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
        try {
            const removed_que = await questions.slice(que.unqid - 1);
            res.status(203);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
};


user_ques = (req, res) => {
    // => /:username/questions
    user_questions = questions.filter(que => que.user === req.user.username);
    res.json(user_questions).status(200);
};

// MIDDLE WARES //
// WORKING
authToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({message: 'invaild token'});
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (req.method === 'GET') return res.redirect(301, '/login');
            else if (req.method === 'POST') return res.redirect(307, '/login');
        } 
        req.user = user;
        next();
    });
};

private = (req, res, next) => {
    if (req.user.username !== req.params.username) {    
        res.json({ message: 'You Can only view your Questions'}).status(400);
    }
    next();
}

allowAdmin = (req, res, next) => {
    if(req.params.username === req.user.username || req.user.role === ROLE.ADMIN){
        next();
        return;
    }
    return res.status(403).json({ message: 'accessed not allowed!'});
}

checkUserParams = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.params.username});
        if (user === null) return res.status(400).json({message: `user doesn't exist`});
        req.params_user = user;
    } catch (err) {
        res.status(500).json({message: `Internal error ${err}`});
    }
    next();
}

module.exports = {
    login, signup, profile, leaderboard, que_submit, user_ques, edit_que, 
    // MIDDLE WARES
    authToken, private, allowAdmin, checkUserParams
};
