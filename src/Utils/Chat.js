const socketIO = require('socket.io');
const user = require('../models/UserSchema'); // Assuming this is the Mongoose model

function handleSocketIO(server) {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:5173", // Replace with your frontend URL
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    io.on('connection', async (socket) => {
        console.log(`${socket.id} connected`);

        socket.on('setCustomId', async (customId) => {
            socket.customId = customId;
            console.log(`Socket ID ${socket.id} is now associated with Custom ID ${socket.customId}`);

            // Update the user's socket ID in the database
            await user.findOneAndUpdate({ _id: customId }, { socketId: socket.id }, { upsert: true });
        });

        socket.on('private chat', async (data) => {
            const { from, to, message } = data;

            // Find the recipient's session using customId
            const recipient = await user.findOne({ _id: to });

            if (recipient && recipient.socketId) {
                io.to(recipient.socketId).emit('private chat', { from, to, message });
                io.to(socket.id).emit('private chat', { from, to, message }); // Also send the message back to the sender
            } else {
                console.log(`Recipient ${to} is not currently connected.`);
                // Handle the case when the recipient is not connected
            }
        });

        socket.on('disconnect', async () => {
            console.log(`User with Socket ID ${socket.id} and Custom ID ${socket.customId} disconnected`);

            // Optionally, you can handle the disconnection logic, such as marking the user as offline in the database
            if (socket.customId) {
                await user.findOneAndUpdate({ _id: socket.customId }, { socketId: null });
            }
        });
    });
}

module.exports = handleSocketIO;
