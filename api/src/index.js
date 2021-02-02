require('./db/mongoose')
const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/user')
const goalRouter = require('./routes/goal')

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/user', userRouter)
app.use('/api/goal', goalRouter)
// app.route('/*').get(function(req, res) {
//     return res.sendFile(path.join(__dirname, '../../frontend/src/index.html'))
// })

app.listen(PORT)