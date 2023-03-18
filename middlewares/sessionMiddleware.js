const session = require("express-session")
require('dotenv').config()

const sessionMiddleware = session({
    name: "meal-chatter",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
});

if (process.env.NODE_ENV === "production") {
	sessionMiddleware.cookie.secure = true;
	sessionMiddleware.cookie.httpOnly = true;
	sessionMiddleware.cookie.domain = process.env.COOKIE_DOMAIN;
}

module.exports = sessionMiddleware;