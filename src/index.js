require('dotenv').config()
const express = require('express')
const mongodb = require('./Utils/Dbconnect')
const App = express();
const cors = require('cors')
const bodyparser= require('body-parser');
const port = process.env.port || 3500;
const passport = require('./Middleware/Passport-config')
const oauthRoutes = require('./Routes/OauthRoute')
const otpRoutes = require('./Routes/otpRoutes')
const inviteRoutes = require('./Routes/inviteRoute')
const http = require('http')
const server = http.createServer(App);
const handleSocketIO = require('./Utils/Chat');



App.use(cors({origin:'http://localhost:5173'}))
App.use(express.json())
App.use(bodyparser.json())
App.use(passport.initialize());
App.use(oauthRoutes)
App.use(otpRoutes)
App.use(inviteRoutes)
handleSocketIO(server);
const startServer = async () => {
    try {
        await mongodb();
        console.log("connected")
        server.listen(port, () => console.log(`port is running on ${port}`))
    } catch (error) {
        console.log(error)
    }
}

startServer();