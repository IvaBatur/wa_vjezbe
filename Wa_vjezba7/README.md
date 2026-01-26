# Pizza Express - JWT Autentifikacija
## Nadogradnja pizza poslužitelja s autentifikacijom korisnika i JWT tokenom.

### Instaliranje i pokretanje frontenda i backenda 


### 1. Backend
```bash
# Navigirati do backend folder-a
cd pizza-express

# Instalirati dependencije
npm install

# Kreirati .env file
cp .env.example .env

# Dodati .env file i vlastite MongoDB podatke:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
# MONGO_DB_NAME=pizza_db
# PORT=3000
# JWT_SECRET=tajni_kljuc

# Pokrenuti backend server
npm start
```

Backend će biti dostupan na: `http://localhost:3000`

### 2. Frontend 
```bash
# Otvoriti NOVI terminal
# Navigirati do frontend folder-a
cd pizza-vue

# Instalirati dependencije
npm install

# Pokrenuti development server
npm run dev
```

Frontend će biti dostupan na: `http://localhost:5173`

