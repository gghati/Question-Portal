const Joi = require('joi');
const data = require('../json-data');

show_all = (req, res) => {
    res.send(data);
};

show_single = (req, res) => {
    const course = data.find(c => c.id === parseInt(req.params.id));

    if(!course){
        res.status(404).send(`Given ID that is ${req.params.id} doesn't found!`);
    } else {
        res.send(course);
    }
};

add_user = (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const course = {
        "id": data.length + 1,
        "name": req.body.name
    };

    data.push(course);
    res.send(course);
};

update_user = (req, res) => {
    var course = data.find(c => c.id === parseInt(req.params.id));
    console.log(course);
    if(!course){
        res.status(404).send('Course Not Found');
        return;
    }

    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
};

delete_user = (req, res) => {
    var course = data.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Course Not Found');

    const index = data.indexOf(course)
    data.splice(index, 1);

    res.send(course);
};

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
};

module.exports = {
    show_all,
    show_single,
    add_user,
    update_user,
    delete_user
};