const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
}

const users = [
    {
        "id": 1,
        "username": "gg",
        "password": "1234",
        "fullname": "Gaurav Ghati",
        "numberQue": 5,
        "role": ROLE.BASIC
    },
    {
        "id": 2,
        "username": "gauravghati",
        "password": "12345",
        "fullname": "Gaurav Ghati",
        "numberQue": 2,
        "role": ROLE.ADMIN
    },
    {
        "id": 3,
        "username": "Gaurav",
        "password": "123456",
        "fullname": "Gaurav Ghati",
        "numberQue": 8,
        "role": ROLE.BASIC
    },
];

const questions = [
    {
        "heading": "title 1",
        "statement": "this is statement of question 1",
        "opt1": "option 1.1",
        "opt2": "option 1.2",
        "opt3": "option 1.3",
        "opt4": "option 1.4",
        "user": "gaurav",
        "rightopt": 2
    },
    {
        "heading": "title 2",
        "statement": "this is statement of question 2",
        "opt1": "option 2.1",
        "opt2": "option 2.2",
        "opt3": "option 2.3",
        "opt4": "option 2.4",
        "user": "gauravghati",
        "rightopt": 2
    },
    {
        "heading": "title 3",
        "statement": "this is statement of question 3",
        "opt1": "option 3.1",
        "opt2": "option 3.2",
        "opt3": "option 3.3",
        "opt4": "option 3.4",
        "user": "gauravghati",
        "rightopt": 2
    }
]

module.exports = {
    ROLE,
    users,
    questions
}