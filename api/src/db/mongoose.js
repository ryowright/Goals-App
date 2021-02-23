const mongoose = require('mongoose')
require('dotenv').config;


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    // autoindex: false // -- add later when deploying
}).catch((e) => console.log('Unable to connect to database.'))