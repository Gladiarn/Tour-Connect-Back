import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.ts'
import destinationRoutes from './routes/destinationRoutes.ts'
import hotelRoutes from './routes/hotelRoutes.ts'
import packageRoutes from './routes/packageRoutes.ts'
import bookingRoutes from './routes/bookingRoutes.ts'

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

//destinations
app.use('/api/destination', destinationRoutes);

//hotels
app.use('/api/hotels', hotelRoutes);

//packages
app.use('/api/packages', packageRoutes);

//booking
app.use('/api/bookings', bookingRoutes);

export default app;