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
            users.sort((b, a) => {return a.currentQue - b.currentQue});
            // console.log(users);
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({message: err});
        }
    }
}

que_submit = async (req, res) => {
    // => /:username/submit
    try{
        const user = await User.findOne({username: req.user.username})
        if (req.method === 'POST') {
            question = new Question({
                queid: user.numberQue + 1,
                heading: req.body.heading,
                statement: req.body.statement,
                opt1: req.body.opt1,
                opt2: req.body.opt2,
                opt3: req.body.opt3,
                opt4: req.body.opt4,
                username: req.user.username,
                rightopt: req.body.rightopt,
                is_varified: 'no'
            });
            user.numberQue += 1;
            user.currentQue += 1;
            await user.save();
            await question.save();
            
            res.status(201).json(question.toJSON());
        }
    } catch (err) {
        console.log(`Error ${err}`);
    }
}; 

// WORKING
edit_que = async (req, res) => {
    // => /:username/:que
    try {
        if (req.params_user == null || req.params_que == null) return res.status(400).json({ message: 'que not exist!'});
    
        // WORKING GET POST 
        if (req.method === 'GET')
            res.json(req.params_que).status(200);
    
        else if (req.method === 'PUT') {
            req.params_que.heading = req.body.heading;
            req.params_que.statement = req.body.statement;
            req.params_que.opt1 = req.body.opt1;
            req.params_que.opt2 = req.body.opt2;
            req.params_que.opt3 = req.body.opt3;
            req.params_que.opt4 = req.body.opt4;
            req.params_que.rightopt = req.body.rightopt;
            
            console.log(req.params_que);
            await req.params_que.save();
            res.json(req.params_que).status(200);
        }
        else if (req.method === 'DELETE') {
            await req.params_que.remove();
            req.params_user.currentQue = req.params_user.currentQue - 1;
            await req.params_user.save();
            res.status(203).json({message: "deleted Successfully"});
        }
    } catch (err) {
        res.json({message: `INternal Error ${err}`}).status();
    }
};

user_ques = async (req, res) => {
    // => /:username/questions
    try {
        const user_questions = await Question.find({username: req.user.username});
        res.status(200).json(user_questions);
    } catch (err) {
        res.status(500).json({message: `Internal error ${err}`});
    }
    res.json(user_questions).status(200);
};

adminQue = async (req, res) => {
    // => /admin/
    try {
        const user_questions = await Question.find();
        res.status(200).json(user_questions);
    } catch (err) {
        res.status(500).json({message: `Internal error ${err}`});
    }
};

rangeQue = async (req, res) => {
    // => /admin/:lower/:upper
    try{
        const user_ques = await Question.find();
        const range_user = new Array();
        lower = parseInt(req.params.lower);
        upper = parseInt(req.params.upper);
        for(var i=lower; i<=upper; i++)
            range_user.push(user_ques[i]);
        res.status(200).json(range_user);
    } catch (err) {
        res.json({message: `Internal Errors: ${err}`}).status(200);
    }
};

partQue = async (req, res) => {
    // => /admin/:queid
    try{
        const all_ques = await Question.find();

        if (req.method === 'GET'){
            if(req.params.queid > 0 && req.params.queid <= all_ques.length)
                res.status(200).json(all_ques[req.params.queid]);
            else res.status(400).json({message: "Not in range"})
        }
        else if (req.method === 'POST'){
            if (req.body.is_valid != null)
                que = all_ques[req.params.queid];
                que.is_varified = 'yes';
                await que.save();
        }
    } catch (err) {
        res.json({message: `Internal Errors: ${err}`}).status(500);
    }
};

// MIDDLE WARES //
// WORKING
authToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({message: 'invaild token'});
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, user) => {
        if (err) {
            res.status(400).json({message: err.message});
            // if (req.method === 'GET') return res.redirect(301, '/login');
            // else if (req.method === 'POST') return res.redirect(307, '/login');
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

        if (req.params.que != null){
            const que = await Question.findOne({username: req.params.username, queid: req.params.que});
            if (que === null) return res.status(400).json({message: `Question doesn't exist`});
            req.params_que = que;
        }
        req.params_user = user;
    } catch (err) {
        res.status(500).json({message: `Internal error ${err}`});
    }
    next();
}

onlyAdmin= (req, res, next) => {
    if(req.user.role != ROLE.ADMIN){
        res.status(403).json({ message: 'accessed not allowed!'});
    }
    next();
}

module.exports = {
    login, signup, profile, leaderboard, que_submit, user_ques, edit_que, adminQue, rangeQue, partQue,
    // MIDDLE WARES
    authToken, private, allowAdmin, checkUserParams, onlyAdmin
};
