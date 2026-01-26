<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const narudzbe = ref([])
const ucitavanje = ref(false)
const greska = ref(null)

async function dohvatiNarudzbe() {
  try {
    greska.value = null
    ucitavanje.value = true

    const token = localStorage.getItem('jwt_token')
    if (!token) {
      greska.value = 'Morate biti prijavljeni!'
      return
    }

    const response = await axios.get('http://localhost:3000/narudzbe', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    narudzbe.value = response.data.narudzbe
    console.log('Narudžbe dohvaćene:', narudzbe.value)
  } catch (error) {
    console.error('Greška pri dohvaćanju narudžbi:', error)
    
    if (error.response?.status === 401) {
      greska.value = 'Vaš token je istekao. Molimo prijavite se ponovno.'
    } else {
      greska.value = error.response?.data?.greska || 'Greška pri dohvaćanju narudžbi'
    }
  } finally {
    ucitavanje.value = false
  }
}

function formatDatum(datum) {
  return new Date(datum).toLocaleString('hr-HR')
}

onMounted(() => {
  dohvatiNarudzbe()
})
</script>

<template>
  <div class="mx-auto min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
    
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-orange-500 mb-8">Moje narudžbe</h1>

      <div v-if="ucitavanje" class="text-center text-gray-600">
        <p>Učitavanje narudžbi...</p>
      </div>

      <div v-if="greska" class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
        <p>{{ greska }}</p>
      </div>

      <div v-if="!ucitavanje && narudzbe.length === 0" class="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center">
        <p class="text-gray-600 text-lg">Nemate nikakvih narudžbi</p>
      </div>

      <div v-if="narudzbe.length > 0" class="space-y-6">
        <div 
          v-for="narudzba in narudzbe" 
          :key="narudzba._id"
          class="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-xl font-bold text-orange-500">{{ narudzba.ime }}</h2>
              <p class="text-sm text-gray-600">{{ formatDatum(narudzba.datum) }}</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-orange-500">€{{ narudzba.ukupna_cijena }}</p>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <p class="font-semibold text-gray-700 mb-2">Stavke:</p>
            <ul class="space-y-2">
              <li 
                v-for="(stavka, index) in narudzba.narucene_pizze"
                :key="index"
                class="flex justify-between text-gray-600"
              >
                <span>{{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}</span>
              </li>
            </ul>
          </div>

          <div class="border-t border-gray-200 pt-4 mt-4">
            <p class="text-sm"><span class="font-semibold">Adresa:</span> {{ narudzba.adresa }}</p>
            <p class="text-sm"><span class="font-semibold">Telefon:</span> {{ narudzba.telefon }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>