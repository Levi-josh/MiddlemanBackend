require('dotenv').config();
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
const paymentRoutes = require('./Routes/PaymentRoute')
const http = require('http')
const cookieParser = require('cookie-parser');
const server = http.createServer(App);
const handleSocketIO = require('./Utils/Chat');
// const session = require('express-session');
const fs = require('fs');
const path = require('path');
const MongoStore = require('connect-mongo');
const errorhandler = require('./Middleware/Error')
const jwtMiddleware = require('./Middleware/JwtMiddleware')
App.use(cors({
    origin:['http://localhost:5173','https://middlemanapp-nc5k.onrender.com'],
    methods:['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
    credentials: true,
}))
// App.use(session({
//     secret: 'your-secret-key',  // Replace with a strong secret key
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: process.env.Database,  // Use your MongoDB URI
//       collectionName: 'sessions', // Name of the collection in MongoDB
//     }),
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24 // Session will last for 1 day
//     }
//   }));
App.use(express.json())
App.use(bodyparser.json())
App.use(cookieParser());
App.use(passport.initialize());
// App.use(passport.session());
App.use(oauthRoutes)
App.use(jwtRoutes)
App.use(otpRoutes)
// App.use(jwtMiddleware)
App.use(inviteRoutes)
App.use(infoRoutes)
App.use(paymentRoutes)
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
App.use('/uploads', express.static(path.join(__dirname, 'uploads')));
App.use('/assets', express.static(path.join(__dirname, 'Assets')));
handleSocketIO(server);
App.use(errorhandler)
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