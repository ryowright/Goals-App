const mongoose = require('mongoose')

const URI = 
    'mongodb+srv://dbUser:dbUserPassword@cluster0.f8zhd.mongodb.net/Cluster0?retryWrites=true&w=majority';

mongoose.connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
    // autoindex: false -- add later when deploying
}).catch((e) => console.log('Unable to connect to database.'))