const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '') // works with postman
        // const token = req.headers.authorization.replace('Bearer ', '') // works with axios
        const decoded = jwt.verify(token, 'thesearemygoals')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error('No token found for user.')
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send(e)
    }
}

module.exports = auth