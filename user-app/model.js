const mongoose = require('mongoose');

const user_schema = mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, default: 'basic' },
    numberQue: { type: Number, default: 0 }
})

const que_schema = mongoose.Schema({
    unqid: {type: Number, require: true},
    queid: {type: Number, require: true},
    heading: { type: String, require: true },
    statement: { type: String, require: true },
    opt1: { type: String, require: true },
    opt2: { type: String, require: true },
    opt3: { type: String, require: true},
    opt4: { type: String, require: true },
    rightopt: { type: Number, require: true },
    date: { type: Date, require: true, default: Date.now }
});

User = mongoose.model('User', user_schema, 'users');
Question = mongoose.model('Question', que_schema, 'questions');
    
module.exports = {
    User,
    Question
}