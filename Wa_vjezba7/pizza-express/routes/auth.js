import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../db.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET je obavezan u .env datoteci!');
}

const SALT_ROUNDS = 10;

router.post('/registracija', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const korisniciCollection = db.collection('korisnici');

    const { korisnicko_ime, lozinka } = req.body;

    if (!korisnicko_ime || !lozinka) {
      return res.status(400).json({ 
        greska: 'Korisničko ime i lozinka su obavezni' 
      });
    }

    if (korisnicko_ime.length < 3) {
      return res.status(400).json({ 
        greska: 'Korisničko ime mora imati najmanje 3 znaka' 
      });
    }

    if (lozinka.length < 6) {
      return res.status(400).json({ 
        greska: 'Lozinka mora imati najmanje 6 znakova' 
      });
    }

    const postojeciKorisnik = await korisniciCollection.findOne({ 
      korisnicko_ime: korisnicko_ime.toLowerCase() 
    });

    if (postojeciKorisnik) {
      return res.status(400).json({ 
        greska: 'Korisničko ime je već zauzeto' 
      });
    }

    const hashiranaLozinka = await bcrypt.hash(lozinka, SALT_ROUNDS);

    const rezultat = await korisniciCollection.insertOne({
      korisnicko_ime: korisnicko_ime.toLowerCase(),
      lozinka: hashiranaLozinka,
      datum_kreiranja: new Date()
    });

    res.status(201).json({ 
      poruka: 'Korisnik uspješno registriran',
      korisnik_id: rezultat.insertedId 
    });
  } catch (error) {
    console.error('Greška pri registraciji:', error);
    res.status(500).json({ greska: 'Greška pri registraciji' });
  }
});

router.post('/prijava', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const korisniciCollection = db.collection('korisnici');

    const { korisnicko_ime, lozinka } = req.body;

    if (!korisnicko_ime || !lozinka) {
      return res.status(400).json({ 
        greska: 'Korisničko ime i lozinka su obavezni' 
      });
    }

    const korisnik = await korisniciCollection.findOne({ 
      korisnicko_ime: korisnicko_ime.toLowerCase() 
    });

    if (!korisnik) {
      return res.status(401).json({ 
        greska: 'Korisničko ime ili lozinka nisu ispravni' 
      });
    }

    const lozinkaIspravna = await bcrypt.compare(lozinka, korisnik.lozinka);

    if (!lozinkaIspravna) {
      return res.status(401).json({ 
        greska: 'Korisničko ime ili lozinka nisu ispravni' 
      });
    }

    const token = jwt.sign(
      { 
        korisnik_id: korisnik._id.toString(),
        korisnicko_ime: korisnik.korisnicko_ime 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      poruka: 'Uspješna prijava',
      token,
      korisnik: {
        korisnik_id: korisnik._id,
        korisnicko_ime: korisnik.korisnicko_ime
      }
    });
  } catch (error) {
    console.error('Greška pri prijavi:', error);
    res.status(500).json({ greska: 'Greška pri prijavi' });
  }
});

export default router;