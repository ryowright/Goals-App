require('./db/mongoose');
const express = require('express');
const path = require('path');
const cors = require('cors');
const userRouter = require('./routes/user');
const goalRouter = require('./routes/goal');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, '../../dist')))

app.use(express.json());
app.use(cors());
app.use('/api/user', userRouter);
app.use('/api/goal', goalRouter);
// app.route('/*').get(function(req, res) {
//     return res.sendFile(path.join(__dirname, '../../frontend/src/index.html'))
// })
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT);