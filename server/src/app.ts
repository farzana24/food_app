import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pino } from 'pino';
import authRoutes from './routes/auth.routes';

const app = express();
const logger = pino();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'RideNBite API is running' });
});

export { app, logger };
