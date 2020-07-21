const express = require('express');
const Joi = require('joi');
const data = require('./json-data');
const path = require('path')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get();
// app.put();
// app.post();
// app.delete();

// parameters and Query parameters
// app.get('/api/:year/:month', (req, res) => {
//     res.send(`year : ${req.params.year}, month: ${req.params.month}, ${req.query.test}`);
// });

app.get('/api/course', (req, res) => {
    res.send(data);
});

app.get('/api/course/:id', (req, res) => {
    const course = data.find(c => c.id === parseInt(req.params.id));

    if(!course){
        res.status(404).send(`Given ID that is ${req.params.id} doesn't found!`);
    } else {
        res.send(course);
    }
});

app.post('/api/course', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const course = {
        "id": data.length + 1,
        "name": req.body.name
    };

    data.push(course);
    res.send(course);
});

app.put('/api/course/:id', (req, res) => {
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
});

app.delete('/api/course/:id', (req, res) => {
    var course = data.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Course Not Found');

    const index = data.indexOf(course)
    data.splice(index, 1);

    res.send(course);
});

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

// set a static folder
app.use(express.static(path.join(__dirname, 'public')))

// env value PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server stared on ${PORT}`));
