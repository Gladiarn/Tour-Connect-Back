import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.ts'
const app = express();
const PORT = process.env.PORT || 5000;

// global middleware
app.use(cors({
    origin:[ 'http://localhost:3000']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// users
app.use('/api/users', userRoutes);



export default app;