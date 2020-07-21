const express = require('express');
const path = require('path')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/course', require('./course_app/routes'))

// set a static folder
app.use(express.static(path.join(__dirname, 'public')))

// env value PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server stared on ${PORT}`));
