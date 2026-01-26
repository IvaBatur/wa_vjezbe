<script setup>
import { ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['login-success'])

const tab = ref('prijava') 
const korisnicko_ime = ref('')
const lozinka = ref('')
const lozinkaPotvrdaj = ref('')

const statusPoruka = ref(null)
const ucitavanje = ref(false)

async function prijaviKorisnika() {
  try {
    statusPoruka.value = null
    ucitavanje.value = true

    if (!korisnicko_ime.value.trim() || !lozinka.value.trim()) {
      statusPoruka.value = {
        tip: 'error',
        tekst: 'Molimo unesite korisničko ime i lozinku'
      }
      return
    }
    const response = await axios.post('http://localhost:3000/auth/prijava', {
      korisnicko_ime: korisnicko_ime.value.trim(),
      lozinka: lozinka.value
    })

    localStorage.setItem('jwt_token', response.data.token)
    localStorage.setItem('korisnicko_ime', response.data.korisnik.korisnicko_ime)

    statusPoruka.value = {
      tip: 'success',
      tekst: 'Uspješna prijava! Preusmeravanja...'
    }
    setTimeout(() => {
      emit('login-success', response.data.korisnik)
    }, 1000)

  } catch (error) {
    console.error('Greška pri prijavi:', error)
    statusPoruka.value = {
      tip: 'error',
      tekst: error.response?.data?.greska || 'Greška pri prijavi'
    }
  } finally {
    ucitavanje.value = false
  }
}
async function registrirajKorisnika() {
  try {
    statusPoruka.value = null
    ucitavanje.value = true

    if (!korisnicko_ime.value.trim() || !lozinka.value.trim()) {
      statusPoruka.value = {
        tip: 'error',
        tekst: 'Molimo unesite korisničko ime i lozinku'
      }
      return
    }

    if (lozinka.value !== lozinkaPotvrdaj.value) {
      statusPoruka.value = {
        tip: 'error',
        tekst: 'Lozinke se ne podudaraju'
      }
      return
    }
    const response = await axios.post('http://localhost:3000/auth/registracija', {
      korisnicko_ime: korisnicko_ime.value.trim(),
      lozinka: lozinka.value
    })

    statusPoruka.value = {
      tip: 'success',
      tekst: 'Registracija uspješna! Prijavite se sada.'
    }

    korisnicko_ime.value = ''
    lozinka.value = ''
    lozinkaPotvrdaj.value = ''

    setTimeout(() => {
      tab.value = 'prijava'
    }, 1500)

  } catch (error) {
    console.error('Greška pri registraciji:', error)
    statusPoruka.value = {
      tip: 'error',
      tekst: error.response?.data?.greska || 'Greška pri registraciji'
    }
  } finally {
    ucitavanje.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-cover bg-center flex items-center justify-center p-4" style="background-image: url('/background1.jpg')">
    <div class="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-md p-8">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-orange-600 mb-2"> Pizza Express</h1>
        <p class="text-gray-600">Fresh • Fast • Hot</p>
      </div>

   
      <div class="flex gap-4 mb-8">
        <button
          @click="tab = 'prijava'"
          :class="[
            'flex-1 py-2 px-4 rounded-lg font-semibold transition-all',
            tab === 'prijava'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          Prijava
        </button>
        <button
          @click="tab = 'registracija'"
          :class="[
            'flex-1 py-2 px-4 rounded-lg font-semibold transition-all',
            tab === 'registracija'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          Registracija
        </button>
      </div>

      <div v-if="tab === 'prijava'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Korisničko ime
          </label>
          <input
            v-model="korisnicko_ime"
            type="text"
            placeholder="Unesite korisničko ime"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :disabled="ucitavanje"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Lozinka
          </label>
          <input
            v-model="lozinka"
            type="password"
            placeholder="Unesite lozinku"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :disabled="ucitavanje"
          />
        </div>

        <button
          @click="prijaviKorisnika"
          :disabled="ucitavanje"
          class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-all"
        >
          {{ ucitavanje ? 'Prijava u tijeku...' : 'Prijava' }}
        </button>
      </div>

    
      <div v-if="tab === 'registracija'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Korisničko ime
          </label>
          <input
            v-model="korisnicko_ime"
            type="text"
            placeholder="Najmanje 3 znaka"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :disabled="ucitavanje"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Lozinka
          </label>
          <input
            v-model="lozinka"
            type="password"
            placeholder="Najmanje 6 znakova"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :disabled="ucitavanje"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Potvrdite lozinku
          </label>
          <input
            v-model="lozinkaPotvrdaj"
            type="password"
            placeholder="Ponovite lozinku"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :disabled="ucitavanje"
          />
        </div>

        <button
          @click="registrirajKorisnika"
          :disabled="ucitavanje"
          class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-all"
        >
          {{ ucitavanje ? 'Registracija u tijeku...' : 'Registracija' }}
        </button>
      </div>

    
      <div
        v-if="statusPoruka"
        :class="[
          'mt-6 p-4 rounded-lg border',
          statusPoruka.tip === 'success'
            ? 'bg-green-100 border-green-300 text-green-700'
            : 'bg-red-100 border-red-300 text-red-700'
        ]"
      >
        <p class="font-semibold">{{ statusPoruka.tekst }}</p>
      </div>
    </div>
  </div>
</template>