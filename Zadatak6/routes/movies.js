import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import movies from '../data/movies.js';
import { findMovieById } from '../middleware/middleware.js';

const router = express.Router();

const provjeriGreske = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/',
  [
    query('min_year').optional().isInt().toInt().escape(),
    query('max_year').optional().isInt().toInt().escape(),
    query('min_year').custom((value, { req }) => {
      if (req.query.max_year && parseInt(value) > parseInt(req.query.max_year)) {
        throw new Error('min_year mora biti manji od max_year');
      }
      return true;
    })
  ],
  provjeriGreske,
  (req, res) => {
    let rezultat = movies;
    
    if (req.query.min_year) {
      rezultat = rezultat.filter(m => m.year >= parseInt(req.query.min_year));
    }
    if (req.query.max_year) {
      rezultat = rezultat.filter(m => m.year <= parseInt(req.query.max_year));
    }
    
    res.json(rezultat);
  }
);

router.get('/:id',
  [
    param('id').isInt().withMessage('ID must be a number').toInt().escape()
  ],
  provjeriGreske,
  findMovieById,
  (req, res) => {
    res.json(req.movie);
  }
);

router.post('/',
  [
    body('title').notEmpty().withMessage('Title is required').trim().escape(),
    body('year').notEmpty().isInt().withMessage('Year must be a number').toInt(),
    body('genre').notEmpty().withMessage('Genre is required').trim().escape(),
    body('director').notEmpty().withMessage('Director is required').trim().escape()
  ],
  provjeriGreske,
  (req, res) => {
    const noviFilm = {
      id: Math.floor(Math.random() * 10000000),
      title: req.body.title,
      year: req.body.year,
      genre: req.body.genre,
      director: req.body.director
    };
    
    movies.push(noviFilm);
    res.status(201).json(noviFilm);
  }
);
router.patch('/:id',
  [
    param('id').isInt().toInt().escape(),
    body('title').optional().trim().escape(),
    body('year').optional().isInt().toInt(),
    body('genre').optional().trim().escape(),
    body('director').optional().trim().escape(),
    body().custom((value) => {
      if (!value.title && !value.year && !value.genre && !value.director) {
        throw new Error('At least one parameter must be provided');
      }
      return true;
    })
  ],
  provjeriGreske,
  findMovieById,
  (req, res) => {
    if (req.body.title) req.movie.title = req.body.title;
    if (req.body.year) req.movie.year = req.body.year;
    if (req.body.genre) req.movie.genre = req.body.genre;
    if (req.body.director) req.movie.director = req.body.director;
    
    res.json(req.movie);
  }
);


export default router;
