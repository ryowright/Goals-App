require('./db/mongoose');
require("regenerator-runtime/runtime");
const express = require('express');
const path = require('path');
const cors = require('cors');
const userRouter = require('./routes/user');
const goalRouter = require('./routes/goal');

const app = express();

app.use(express.static(path.join(__dirname, '../../dist')))

app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/goal', goalRouter);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

module.exports = app;