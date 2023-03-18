const { Console } = require("console");
const session = require("express-session")
require('dotenv').config()

const sessionMiddleware = session({
    name: "meal-chatter",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        domain: process.env.COOKIE_DOMAIN
    }
});

module.exports = sessionMiddleware;