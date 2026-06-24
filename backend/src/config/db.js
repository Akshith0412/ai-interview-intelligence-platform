const mongoose = require('mongoose')

console.log("DB FILE LOADED");
console.log("URI:", process.env.MONGO_URI);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;