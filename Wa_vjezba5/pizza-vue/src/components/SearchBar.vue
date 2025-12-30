<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

const naziv = ref('')
const cijenaMin = ref(null)
const cijenaMax = ref(null)
const sortOrder = ref('')

function handleSearch() {
  emit('search', {
    naziv: naziv.value,
    cijena_min: cijenaMin.value || undefined,
    cijena_max: cijenaMax.value || undefined,
    sort: sortOrder.value || undefined
  })
}

function resetFilters() {
  naziv.value = ''
  cijenaMin.value = null
  cijenaMax.value = null
  sortOrder.value = ''
  handleSearch()
}
</script>

<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
    <h2 class="text-2xl font-bold text-orange-500 mb-6"> Pretraži pizze</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
   
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Naziv pizze
        </label>
        <input
          v-model="naziv"
          type="text"
          @input="handleSearch"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>


      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Min. cijena (€)
        </label>
        <input
          v-model.number="cijenaMin"
          type="number"
          step="0.5"
          min="0"
          @input="handleSearch"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Max. cijena (€)
        </label>
        <input
          v-model.number="cijenaMax"
          type="number"
          step="0.5"
          min="0"
          @input="handleSearch"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Sortiraj po cijeni
        </label>
        <select
          v-model="sortOrder"
          @change="handleSearch"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value=""> Bez sortiranja </option>
          <option value="asc">Od najjeftinije</option>
          <option value="desc">Od najskuplje</option>
        </select>
      </div>
    </div>

    
    <div class="mt-4 flex justify-end">
      <button
        @click="resetFilters"
        class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
      >
     Resetiraj filtere
      </button>
    </div>
  </div>
</template>