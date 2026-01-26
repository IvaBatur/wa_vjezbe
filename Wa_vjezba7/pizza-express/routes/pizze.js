import express from 'express';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const pizzeCollection = db.collection('pizze');

    await pizzeCollection.createIndex({ naziv: 1 });

    const { naziv, cijena_min, cijena_max, sort } = req.query;

    let filter = {};

    if (naziv) {
      filter.naziv = { $regex: naziv, $options: 'i' };
    }

    if (cijena_min || cijena_max) {
      filter['cijena.mala'] = {};
      if (cijena_min) filter['cijena.mala'].$gte = parseFloat(cijena_min);
      if (cijena_max) filter['cijena.mala'].$lte = parseFloat(cijena_max);
    }

    let sortOption = {};
    if (sort === 'asc') sortOption['cijena.mala'] = 1;
    else if (sort === 'desc') sortOption['cijena.mala'] = -1;

    const pizze = await pizzeCollection.find(filter).sort(sortOption).toArray();
    res.status(200).json(pizze);
  } catch (error) {
    console.error('Greška:', error);
    res.status(500).json({ greska: 'Greška pri dohvaćanju pizza' });
  }
});

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const pizzeCollection = db.collection('pizze');
    const novaPizza = req.body;

    const requiredKeys = ['naziv', 'cijena', 'slika_url', 'sastojci'];
    const receivedKeys = Object.keys(novaPizza);

    const missingKeys = requiredKeys.filter(key => !receivedKeys.includes(key));
    if (missingKeys.length > 0) {
      return res.status(400).json({ greska: `Nedostaju: ${missingKeys.join(', ')}` });
    }

    if (typeof novaPizza.cijena !== 'object' || novaPizza.cijena === null) {
      return res.status(400).json({ greska: 'Cijena mora biti objekt' });
    }

    const velicine = ['mala', 'srednja', 'jumbo'];
    for (let velicina of velicine) {
      if (typeof novaPizza.cijena[velicina] !== 'number') {
        return res.status(400).json({ greska: `Cijena za ${velicina} mora biti broj` });
      }
    }

    if (!Array.isArray(novaPizza.sastojci) || novaPizza.sastojci.length === 0) {
      return res.status(400).json({ greska: 'Sastojci moraju biti neprazan array' });
    }

    if (!novaPizza.sastojci.every(s => typeof s === 'string')) {
      return res.status(400).json({ greska: 'Svaki sastojak mora biti string' });
    }

    const result = await pizzeCollection.insertOne(novaPizza);
    res.status(201).json({ poruka: 'Pizza dodana', id: result.insertedId });
  } catch (error) {
    console.error('Greška:', error);
    res.status(500).json({ greska: 'Greška pri dodavanju pizze' });
  }
});

export default router;