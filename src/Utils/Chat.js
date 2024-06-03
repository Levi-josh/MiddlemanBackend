const socketIO = require('socket.io');
const user = require('../models/UserSchema')
const emitmessage = async(frm,msg,to)=>{
const msgReceiver = await user.findOneAndUpdate({ _id:to }, { $push: { chat: { 'message': msg, 'timestamp': timestamp,'from':frm,'to':to } } }).save()
const msgSender = await user.updateOne({ _id:frm}, { $push: { chat: { 'msg': message, 'timestamp': timestamp,'from':frm,'to':to } } })
return msgReceiver
}
// Function to handle Socket.IO logic
function handleSocketIO(server) {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:5173", // Replace with your frontend URL
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }});

    io.on('connection', async(socket) => {
        console.log(`${socket.id} connected`);
        // Load chat history when a user connects
        // const chatHistory = await Chat.find().sort({ timestamp: -1 }).limit(50).exec();
        // socket.emit('chat history', chatHistory);
        //i should also send the socketId to the database once a user connects
        // await user.findOne({sockedId:})
        //socket.on('getsocket',(soc)=>{ socket.id = soc })
        socket.on('private chat', async (data) => {
        const { from, to, message,timestamp } = data;  
        const session = user.findOne({ _id: to })
        if(!session){
        throw new Error('No user found')
        }
        io.to(to).emit('private chat', {from, to, message});
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

module.exports = handleSocketIO;