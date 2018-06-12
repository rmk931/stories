const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

require('dotenv').config();

require('./config/passport')(passport);


const app = express();

const auth = require('./routes/auth');

app.get('/', (req, res) => {
    res.send('It Works!');
});

app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Servrer on ${port}`);
});