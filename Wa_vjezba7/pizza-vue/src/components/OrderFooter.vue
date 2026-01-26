<script setup>
import { ref, computed } from 'vue' 
import axios from 'axios';

const props = defineProps({
  odabranaPizza: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close']) 

const narucene_pizze = ref([])
const odabranaVelicina = ref('srednja') 
const kolicina = ref(1) 

const ime = ref('')
const adresa = ref('')
const telefon = ref('')

const statusPoruka = ref(null) 

function getCijenaPoVelicini(cijena, velicina) {
  if (typeof cijena === 'object' && cijena !== null) {
    return cijena[velicina] || 0
  }
  return 0
}

const cijene = computed(() => ({
  mala: getCijenaPoVelicini(props.odabranaPizza.cijena, 'mala'),
  srednja: getCijenaPoVelicini(props.odabranaPizza.cijena, 'srednja'),
  jumbo: getCijenaPoVelicini(props.odabranaPizza.cijena, 'jumbo')
}))

const ukupna_cijena_stavke = computed(() => {
  const cijenaPoKomadu = cijene.value[odabranaVelicina.value]
  return (cijenaPoKomadu * kolicina.value).toFixed(2)
})

function dodajUNarudzbu() {
  const stavka = {
    naziv: props.odabranaPizza.naziv,
    velicina: odabranaVelicina.value,
    kolicina: kolicina.value,
    cijena: cijene.value[odabranaVelicina.value]
  }
  
  narucene_pizze.value.push(stavka)
  console.log('Dodano u narudžbu:', stavka)
  console.log('Sve naručene pizze:', narucene_pizze.value)
  
  kolicina.value = 1
}

async function posaljiNarudzbu() {
  try {
    if (narucene_pizze.value.length === 0) {
      statusPoruka.value = {
        tip: 'error',
        tekst: 'Košarica je prazna! Molimo dodajte pizze prije narudžbe.'
      }
      return
    }

    if (!ime.value.trim()) {
      statusPoruka.value = {
        tip: 'error',
        tekst: 'Molimo unesite ime!'
      }
      return
    }

    if (!adresa.value.trim()) {
      statusPoruka.value = {
        tip: 'error',
        tekst: 'Molimo unesite adresu!'
      }
      return
    }

    if (!telefon.value.trim()) {
      statusPoruka.value = {
        tip: 'error',
        tekst: 'Molimo unesite broj telefona!'
      }
      return
    }

    const telefonRegex = /^\d+$/
    if (!telefonRegex.test(telefon.value.trim())) {
      statusPoruka.value = {
        tip: 'error',
        tekst: 'Broj telefona može sadržavati samo brojeve!'
      }
      return
    }

 const token = localStorage.getItem('jwt_token')
    if (!token) {
      statusPoruka.value = {
        tip: 'error',
        tekst: 'Morate biti prijavljeni da biste naručili!'
      }
      return
    }
    const narudzba = {
      ime: ime.value.trim(),
      adresa: adresa.value.trim(),
      telefon: telefon.value.trim(),
      narucene_pizze: narucene_pizze.value.map(stavka => ({
        naziv: stavka.naziv,
        kolicina: stavka.kolicina,
        velicina: stavka.velicina
      }))
    }
    
    const odgovor = await axios.post('http://localhost:3000/narudzbe', narudzba,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  
    console.log('Narudžba uspješno poslana:', odgovor.data)

    statusPoruka.value = {
      tip: 'success',
      tekst: `Narudžba uspješno poslana! Ukupno: €${odgovor.data.ukupna_cijena}`
    }

    narucene_pizze.value = []
    ime.value = ''
    adresa.value = ''
    telefon.value = ''

  } catch (error) {
    console.error('Greška pri slanju narudžbe:', error)
    
 if (error.response?.status === 401) {
      statusPoruka.value = {
        tip: 'error',
        tekst: 'Vaš token je istekao. Molimo prijavite se ponovno.'
      }
    } else {
      statusPoruka.value = {
        tip: 'error',
        tekst: error.response?.data?.greska || 'Došlo je do greške pri slanju narudžbe.'
      }
    }
  }
}

function ukloniStavku(index) {
  if (narucene_pizze.value[index].kolicina > 1) {
    narucene_pizze.value[index].kolicina--
  } else {
    narucene_pizze.value.splice(index, 1)
  }
}
</script>

<template>
  <div v-if="odabranaPizza" class="fixed bottom-0 left-0 right-0 bg-slate-800 text-white shadow-lg p-4">
      
    <button class="absolute top-2 right-2 text-slate-300 hover:text-white text-xl font-bold cursor-pointer" @click="emit('close')">×</button>
    
    <div class="max-w-5xl mx-auto flex items-center justify-between gap-4">

      <div class="flex items-center gap-4">
        <img 
          :src="odabranaPizza.slika_url" 
          :alt="odabranaPizza.naziv" 
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md shadow-black/40" 
        />
        <div>
          <h3 class="font-bold tracking-wide text-base sm:text-lg text-orange-400">
            {{ odabranaPizza.naziv }}
          </h3>
          <p class="text-sm text-slate-300">{{ odabranaPizza.sastojci.join(', ') }}</p>
        </div>
      </div>

      <div class="flex items-center justify-center sm:justify-start flex-wrap gap-2 w-full sm:w-auto">
        <button
          v-for="(cijena, velicina) in cijene"
          :key="velicina"
          @click="odabranaVelicina = velicina"
          :class="[
            'px-3 py-1 rounded-lg border border-slate-500 text-sm sm:text-base hover:bg-orange-500 hover:text-white transition-all cursor-pointer',
            odabranaVelicina === velicina
              ? 'bg-orange-500 text-white'
              : 'bg-slate-600/40 text-white'
          ]"
        >
          {{ velicina }} – €{{ cijena.toFixed(2) }}
        </button>
      </div>
  
      <div class="flex items-center gap-3">
        <button 
          @click="kolicina > 1 ? kolicina-- : kolicina = 1"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
        >
          -
        </button>
        <div class="px-3 py-1 bg-slate-600/40 backdrop-blur-sm rounded-md border border-slate-500 text-sm sm:text-base">
          {{ kolicina }}
        </div>
        <button 
          @click="kolicina++"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
        >
          +
        </button>
      </div>

      <div class="w-full sm:w-auto text-center font-semibold text-lg text-orange-400 tracking-wide">
        Ukupno: €{{ ukupna_cijena_stavke || '0.00' }}
      </div>

      <button
        @click="dodajUNarudzbu"
        class="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-bold"
      >
        Dodaj u košaricu
      </button>
    </div>

    <div
      v-if="narucene_pizze.length"
      class="mt-4 max-w-2xl mx-auto max-h-40 overflow-y-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-600"
    >
      <h4 class="font-semibold text-lg text-white mb-2">Stavke u košarici:</h4>
      <ul class="space-y-2">
        <li
          v-for="(stavka, index) in narucene_pizze"
          :key="index"
          class="flex items-center justify-between bg-slate-700/50 rounded-md p-2"
        >
          <div class="text-white">
            {{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}
          </div>

          <div class="flex items-center gap-3">
            <div class="text-orange-400 font-semibold">
              €{{ (stavka.cijena * stavka.kolicina).toFixed(2) }}
            </div>
            <button
              @click="ukloniStavku(index)"
              class="w-6 h-6 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all"
              title="Ukloni stavku"
            >
              ×
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div 
      v-if="narucene_pizze.length > 0"
      class="mt-4 max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-600"
    >
      <h4 class="font-semibold text-lg text-white mb-3">Podaci za dostavu:</h4>
      
      <div class="space-y-3">
        <div>
          <label class="block text-sm text-slate-300 mb-1">Ime:</label>
          <input 
            v-model="ime"
            type="text" 
            placeholder="Unesite ime"
            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Adresa:</label>
          <input 
            v-model="adresa"
            type="text" 
            placeholder="Unesite adresu"
            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label class="block text-sm text-slate-300 mb-1">Telefon:</label>
          <input 
            v-model="telefon"
            type="tel" 
            placeholder="Unesite broj telefona"
            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          @click="posaljiNarudzbu"
          class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
        >
          Naruči
        </button>
      </div>
    </div>

    <div
      v-if="statusPoruka"
      :class="[
        'mt-4 max-w-2xl mx-auto p-4 rounded-lg border',
        statusPoruka.tip === 'success'
          ? 'bg-green-600/90 border-black text-black'
          : 'bg-red-600/90 border-red-500 text-white'
      ]"
    >
      <div class="flex items-center justify-between">
        <p class="font-semibold">{{ statusPoruka.tekst }}</p>
        <button
          @click="statusPoruka = null"
          class="text-black hover:text-gray-200 font-bold"
        >×</button>
      </div>
    </div>
  </div>
</template>