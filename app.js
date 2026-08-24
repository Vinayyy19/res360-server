import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';
import connectDB from './config/db.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || process.env.port || 5000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'Restaurant360 API',
    status: 'online',
    version: '1.0.0'
  });
});

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Restaurant360 API listening on port ${port}`);
  });
};

startServer();

export default app;