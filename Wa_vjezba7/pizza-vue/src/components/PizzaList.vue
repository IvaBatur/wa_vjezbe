<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { addIcons } from 'oh-vue-icons' 
import OrderFooter from './OrderFooter.vue';
import SearchBar from './SearchBar.vue' 

import { GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, CoHotjar, GiMilkCarton, GiBellPepper, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, GiHamShank } from 'oh-vue-icons/icons';

addIcons(GiTomato, GiCheeseWedge, GiSlicedMushroom, IoLeafSharp, GiBellPepper, GiHamShank, LaPepperHotSolid, GiCannedFish, GiGarlic, FaBacon, CoHotjar, GiMilkCarton)

const ikoneSastojaka = {
  rajčica: 'gi-tomato',
  sir: 'gi-cheese-wedge',
  gljive: 'gi-sliced-mushroom',
  bosiljak: 'io-leaf-sharp',
  paprika: 'gi-bell-pepper',
  šunka: 'gi-ham-shank',
  'feferoni ljuti': 'la-pepper-hot-solid',
  tunjevina: 'gi-canned-fish',
  'crveni luk': 'gi-garlic',
  panceta: 'fa-bacon',
  kulen: 'co-hotjar',
  vrhnje: 'gi-milk-carton'
}

const pizze = ref([]) 
const odabrana_pizza = ref(null)

async function fetchPizze(filters = {}) {
  try {
    const params = {}
    
    if (filters.naziv) params.naziv = filters.naziv
    if (filters.cijena_min) params.cijena_min = filters.cijena_min
    if (filters.cijena_max) params.cijena_max = filters.cijena_max
    if (filters.sort) params.sort = filters.sort
    
    const response = await axios.get('http://localhost:3000/pizze', { params })
    pizze.value = response.data
    console.log('Dohvaćeno pizza:', pizze.value.length)
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka o pizzama:', error)
  }
}

function handleSearch(filters) {
  fetchPizze(filters)
}

function odaberiPizzu(pizza) {
  odabrana_pizza.value = pizza
  console.log('Odabrana pizza:', pizza.naziv)
}

function getCijenaPoVelicini(cijena, velicina) {
  if (typeof cijena === 'object' && cijena !== null) {
    return cijena[velicina]?.toFixed(2) || '0.00'
  }
  return cijena?.toFixed(2) || '0.00'
}

onMounted(() => {
  fetchPizze()
  
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      odabrana_pizza.value = null
    }
  })
})
</script>

<template>
  <div class="mx-auto min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat">
    
    <SearchBar @search="handleSearch" />
    
    <div v-if="pizze.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="pizza in pizze"
        :key="pizza._id"
        @click="odaberiPizzu(pizza)"
        :class="[
          'bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
          odabrana_pizza?.naziv === pizza.naziv
            ? 'ring-4 ring-orange-400 shadow-2xl shadow-orange-300/50 scale-[1.03]'
            : 'hover:scale-[1.02] hover:shadow-xl',
        ]"
      >
        <div class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-t-xl">
          <img 
            :src="pizza.slika_url" 
            :alt="pizza.naziv" 
            class="w-full h-full object-cover" 
          />
        </div>

        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-orange-500 tracking-wide">{{ pizza.naziv }}</h2>
          
            <div class="flex space-x-1">
              <div 
                v-for="sastojak in pizza.sastojci" 
                :key="sastojak" 
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs hover:scale-110 transition-transform"
                :title="sastojak"
              >
                <v-icon :name="ikoneSastojaka[sastojak]" scale="1" />
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-gray-700 py-1 border-b border-gray-200">
              <span class="font-medium">Mala</span>
              <span class="font-bold text-orange-500">€{{ getCijenaPoVelicini(pizza.cijena, 'mala') }}</span>
            </div>

            <div class="flex justify-between text-gray-700 py-1 border-b border-gray-200">
              <span class="font-medium">Srednja</span>
              <span class="font-bold text-orange-500">€{{ getCijenaPoVelicini(pizza.cijena, 'srednja') }}</span>
            </div>

            <div class="flex justify-between text-gray-700 py-1">
              <span class="font-medium">Jumbo</span>
              <span class="font-bold text-orange-500">€{{ getCijenaPoVelicini(pizza.cijena, 'jumbo') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-12 bg-white/90 backdrop-blur-sm p-8 rounded-xl">
      <p class="text-2xl text-gray-600 mb-2"> Nema pizza koje odgovaraju traženim kriterijima</p>
    </div>
    
    <OrderFooter 
      v-if="odabrana_pizza" 
      :odabrana-pizza="odabrana_pizza" 
      @close="odabrana_pizza = null" 
    />
  </div>
</template>