import mongoose from 'mongoose';

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connection successfull..");
    } catch (error) {
        console.log("ERROR in dbConnection..", error);
    }
}

export default dbConnection;