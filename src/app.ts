import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes'
const app = express();
const PORT = process.env.PORT || 5000;

// global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// users

app.use('/api/users', userRoutes);





app.use('/', (req, res) => {
    res.send("API is running");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (error) => {
    console.error('❌ Server failed to start:', error);
});