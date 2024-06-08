const socketIO = require('socket.io');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb')
const user = require('../models/UserSchema'); // Assuming this is the Mongoose model

const updateMessages = async (id, details) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ObjectId');
    }
    const chatId = new ObjectId(id)

    // Define the filter and update objects
    const filter = { 'chats._id': chatId };
    const update = { $push: { 'chats.$.messages': details } }; // Ensure the key is 'messages'

    console.log('Filter:', filter);
    console.log('Update:', update);

    // Perform the update
    const updated = await user.updateOne(filter, update);
    console.log('Update Result:', updated);

    if (updated.matchedCount === 0) {
      console.log('No documents matched the provided query.');
    }
    if (updated.modifiedCount === 0) {
      console.log('The document was found but the update did not result in any changes.');
    }

  } catch (error) {
    console.error('Error updating message:', error);
  }
};

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
      const chatdetails = {
        from,
        to,
        message,
        timestamp: Date.now() // Adding timestamp to details
      };

      // Find the recipient's session using customId
      const recipient = await user.findOne({ _id: to });
      const recipientChatId = recipient.chats.find(prev => prev.userId == from);
      const sender = await user.findOne({ _id: from });
      const senderChatId = sender.chats.find(prev => prev.userId == to);



      const recipientChatIdString = recipientChatId._id.toString();
      const senderChatIdString = senderChatId._id.toString();
      console.log('Recipient Chat ID:', recipientChatIdString);
      console.log('Sender Chat ID:', senderChatIdString);

      if (recipient && recipient.socketId) {
        io.to(recipient.socketId).emit('private chat', { from, to, message });
        await updateMessages(recipientChatIdString, chatdetails);
        io.to(sender.socketId).emit('private chat', { from, to, message }); // Also send the message back to the sender
        await updateMessages(senderChatIdString, chatdetails);
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

