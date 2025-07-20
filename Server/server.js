import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import path from 'path';

import userRouter from './routes/UserRoutes.js' 
import listingRouter from './routes/ListingRouter.js'

const app = express();
const __dirname = path.resolve();

app.use(cookieParser());
app.use(express.json());

dotenv.config();
const PORT = process.env.PORT || 3300;
const MONGO_URL = process.env.MONGOURL

try {
    mongoose.connect(MONGO_URL)
    .then(()=> console.log('Database is connected'))
} catch (error) {
console.log('Database is error ' + error);     
}

app.use("/api/user/", userRouter)
app.use('/api/listing/', listingRouter)

app.use(express.static(path.join(__dirname, '/Client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client', 'dist', 'index.html'));
})

app.use((err, req, res, next ) => {
    const statusCode = err.statusCode || 400;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT} . . .`);
})
