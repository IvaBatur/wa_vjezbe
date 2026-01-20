import movies from '../data/movies.js';
import actors from '../data/actors.js';

const findMovieById = (req, res, next) => {
  const id = parseInt(req.params.id);
  const film = movies.find(m => m.id === id);
  
  if (film) {
    req.movie = film;
    next();
  } else {
    res.status(404).json({ message: 'Film s traženim ID-om nije pronađen' });
  }
};

const findActorById = (req, res, next) => {
  const id = parseInt(req.params.id);
  const glumac = actors.find(a => a.id === id);
  
  if (glumac) {
    req.actor = glumac;
    next();
  } else {
    res.status(404).json({ message: 'Glumac s traženim ID-om nije pronađen' });
  }
};

const logger = (req, res, next) => {
  const sada = new Date();
  const datum = sada.toISOString().split('T')[0];
  const vrijeme = sada.toTimeString().split(' ')[0];
  
  console.log(`[movie-server] [${datum} ${vrijeme}] ${req.method} ${req.url}`);
  
  next();
};

export { findMovieById, findActorById, logger };