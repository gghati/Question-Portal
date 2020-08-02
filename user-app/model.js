const mongoose = require('mongoose');

const user_schema = mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, default: 'basic' },
    numberQue: { type: Number, default: 0 },
    currentQue: { type: Number, default: 0 }
})

// numberQue is count of all the questions submited by the user including deleted questions.
// currentQue is count of the current present number.

const que_schema = mongoose.Schema({
    queid: {type: Number, require: true},
    heading: { type: String, require: true },
    statement: { type: String, require: true },
    opt1: { type: String, require: true },
    opt2: { type: String, require: true },
    opt3: { type: String, require: true},
    opt4: { type: String, require: true },
    username: { type: String, require: true },
    rightopt: { type: Number, require: true },
    is_varified: { type: String, require: true },
    lang: { type: String, require: true}
});

User = mongoose.model('User', user_schema, 'users');
Question = mongoose.model('Question', que_schema, 'questions');
    
module.exports = {
    User,
    Question
}