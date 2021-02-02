const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/goals-app-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
    // autoindex: false -- add later when deploying
}).catch((e) => console.log('Unable to connect to database.'))