import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

app.use('/', router);

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server started at ${PORT}`));