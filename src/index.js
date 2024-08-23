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
const infoRoutes = require('./Routes/InfoRoutes')
const jwtRoutes = require('./Routes/JwtRoutes')
const http = require('http')
const server = http.createServer(App);
const handleSocketIO = require('./Utils/Chat');
const fs = require('fs');
const path = require('path');

App.use(cors({origin:['http://localhost:5173','https://middlemanapp-nc5k.onrender.com']}))
App.use(express.json())
App.use(bodyparser.json())
App.use(passport.initialize());
App.use(oauthRoutes)
App.use(jwtRoutes)
App.use(otpRoutes)
App.use(inviteRoutes)
App.use(infoRoutes)
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

App.use('/uploads', express.static(path.join(__dirname, 'uploads')));
App.use('/assets', express.static(path.join(__dirname, 'Assets')));
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