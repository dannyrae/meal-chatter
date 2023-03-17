const session = require("express-session")
require('dotenv').config()

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
});

module.exports = sessionMiddleware;