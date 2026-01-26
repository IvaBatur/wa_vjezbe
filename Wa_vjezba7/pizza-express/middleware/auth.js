import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ greska: 'Token nije pronađen' });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({ greska: 'Token nije pronađen' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.korisnik = decoded;
    next();
  } catch (error) {
    console.error('JWT greška:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ greska: 'Token je istekao' });
    }
    
    return res.status(401).json({ greska: 'Nevaljani token' });
  }
}