const express = require('express')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

app.use(express.static('public'))

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))