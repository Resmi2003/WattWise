// load .env file
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const router = require('./Routes/router')

// database connection
require('./Connection/db')

// create server
const wattWiseServer = express()

// enable cors
wattWiseServer.use(cors())

// parse json
wattWiseServer.use(express.json())

// add /api prefix
wattWiseServer.use('/api', router)

// static folder for uploads
wattWiseServer.use('/uploads', express.static('./uploads'))

// port
const PORT = process.env.PORT || 5000

// run server
wattWiseServer.listen(PORT, () => {
    console.log(`WattWise-Server started running at PORT: ${PORT}...and waiting for client request`)
})

// test route
wattWiseServer.get('/', (req, res) => {
    res.status(200).send('<h1 style="color:green">WattWise-Server started running successfully....</h1>')
})


