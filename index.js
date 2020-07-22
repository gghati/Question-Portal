const express = require('express');
const path = require('path')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS settings
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested, Content-Type, Accept, Authorization"
    );
    if(req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
})

// main Routes
app.use('/', require('./main-app/routes'));

// set a static folder
app.use(express.static(path.join(__dirname, 'public')))

// env value PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server stared on ${PORT}`));
