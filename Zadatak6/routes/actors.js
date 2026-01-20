import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import actors from '../data/actors.js';
import { findActorById } from '../middleware/middleware.js';

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
    query('name').optional().isString().trim().escape()
  ],
  provjeriGreske,
  (req, res) => {
    let rezultat = actors;
    
    if (req.query.name) {
      rezultat = rezultat.filter(a => 
        a.name.toLowerCase().includes(req.query.name.toLowerCase())
      );
    }
    
    res.json(rezultat);
  }
);

router.get('/:id',
  [
    param('id').isInt().withMessage('ID must be a number').toInt().escape()
  ],
  provjeriGreske,
  findActorById,
  (req, res) => {
    res.json(req.actor);
  }
);
router.post('/',
  [
    body('name').notEmpty().withMessage('Name is required').trim().escape(),
    body('birthYear').notEmpty().isInt().withMessage('BirthYear must be a number').toInt(),
    body('movies').optional().isArray()
  ],
  provjeriGreske,
  (req, res) => {
    const noviGlumac = {
      id: Math.floor(Math.random() * 10000),
      name: req.body.name,
      birthYear: req.body.birthYear,
      movies: req.body.movies || []
    };
    
    actors.push(noviGlumac);
    res.status(201).json(noviGlumac);
  }
);

router.patch('/:id',
  [
    param('id').isInt().toInt().escape(),
    body('name').optional().trim().escape(),
    body('birthYear').optional().isInt().toInt(),
    body('movies').optional().isArray(),
    body().custom((value) => {
      if (!value.name && !value.birthYear && !value.movies) {
        throw new Error('At least one parameter must be provided');
      }
      return true;
    })
  ],
  provjeriGreske,
  findActorById,
  (req, res) => {
    if (req.body.name) req.actor.name = req.body.name;
    if (req.body.birthYear) req.actor.birthYear = req.body.birthYear;
    if (req.body.movies) req.actor.movies = req.body.movies;
    
    res.json(req.actor);
  }
);

export default router;
