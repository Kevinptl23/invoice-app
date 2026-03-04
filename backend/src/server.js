import app from "./app.js";
import dotenv from 'dotenv';
import dbConnection from './config/db.js'

dotenv.config();

const PORT = process.env.PORT || 8080;
dbConnection();

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
})