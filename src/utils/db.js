const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        });
        console.log('MongoDB connected successfully...');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the process with failure
    }

    // Log Mongoose connection events
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
    });

    // Gracefully close MongoDB connection on app termination
    process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('Mongoose connection closed due to app termination');
        process.exit(0);
    });
};

module.exports = connectDB;
