import express from 'express';
import { logger } from './middleware/middleware.js';
import moviesRouter from './routes/movies.js';
import actorsRouter from './routes/actors.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);

app.use('/movies', moviesRouter);
app.use('/actors', actorsRouter);

app.listen(PORT, (error) => {
  if (error) {
    console.log('Greška:', error.message);
  } else {
    console.log('Server radi na http://localhost:' + PORT);
  }

});
