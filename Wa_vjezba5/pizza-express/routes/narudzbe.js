import express from 'express';
import { connectToDatabase } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const narudzbeCollection = db.collection('narudzbe');
    const pizzeCollection = db.collection('pizze');

    const novaNarudzba = req.body;

    const requiredKeys = ['ime', 'adresa', 'telefon', 'narucene_pizze'];
    const missingKeys = requiredKeys.filter(key => !Object.keys(novaNarudzba).includes(key));
    
    if (missingKeys.length > 0) {
      return res.status(400).json({ greska: `Nedostaju: ${missingKeys.join(', ')}` });
    }

    const telefonString = String(novaNarudzba.telefon);
    if (!/^\d+$/.test(telefonString)) {
      return res.status(400).json({ greska: 'Telefon mora sadržavati samo brojeve' });
    }

    if (!Array.isArray(novaNarudzba.narucene_pizze) || novaNarudzba.narucene_pizze.length === 0) {
      return res.status(400).json({ greska: 'Mora biti barem 1 pizza' });
    }

    const validVelicine = ['mala', 'srednja', 'jumbo'];
    
    for (let i = 0; i < novaNarudzba.narucene_pizze.length; i++) {
      const stavka = novaNarudzba.narucene_pizze[i];
      
      if (!stavka.naziv || !stavka.kolicina || !stavka.velicina) {
        return res.status(400).json({ greska: `Stavka ${i + 1}: nedostaju podaci` });
      }
      
      if (typeof stavka.kolicina !== 'number' || stavka.kolicina <= 0) {
        return res.status(400).json({ greska: `Stavka ${i + 1}: količina mora biti pozitivan broj` });
      }
      
      if (!validVelicine.includes(stavka.velicina)) {
        return res.status(400).json({ greska: `Stavka ${i + 1}: veličina mora biti mala/srednja/jumbo` });
      }
    }

    let ukupna_cijena = 0;

    for (const stavka of novaNarudzba.narucene_pizze) {
      const pizza = await pizzeCollection.findOne({ naziv: stavka.naziv });
      
      if (!pizza) {
        return res.status(404).json({ greska: `Pizza '${stavka.naziv}' ne postoji` });
      }

      if (!pizza.cijena || typeof pizza.cijena[stavka.velicina] !== 'number') {
        return res.status(400).json({ greska: `Pizza nema cijenu za veličinu ${stavka.velicina}` });
      }

      const cijena_po_pizzi = pizza.cijena[stavka.velicina];
      ukupna_cijena += cijena_po_pizzi * stavka.kolicina;
    }

    novaNarudzba.ukupna_cijena = parseFloat(ukupna_cijena.toFixed(2));
    novaNarudzba.datum = new Date();
    novaNarudzba.telefon = telefonString;

    const result = await narudzbeCollection.insertOne(novaNarudzba);

    res.status(201).json({
      poruka: 'Narudžba uspješno kreirana',
      id: result.insertedId,
      ukupna_cijena: novaNarudzba.ukupna_cijena
    });
  } catch (error) {
    console.error('Greška:', error);
    res.status(500).json({ greska: 'Greška pri kreiranju narudžbe' });
  }
});

export default router;
