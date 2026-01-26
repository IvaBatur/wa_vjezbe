import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { connectToDatabase } from './db.js';
import pizzeRouter from './routes/pizze.js';
import narudzbeRouter from './routes/narudzbe.js';
import authRouter from './routes/auth.js';

config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:5173'
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    poruka: 'Pizza app - MongoDB verzija',
    endpointi: {
      pizze: '/pizze (GET, POST)',
      narudzbe: '/narudzbe (POST)'
    }
  });
});

app.use('/auth', authRouter);
app.use('/pizze', pizzeRouter);
app.use('/narudzbe', narudzbeRouter);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Pizza poslužitelj sluša na http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error(' Greška pri pokretanju servera:', error);
    process.exit(1);
  });