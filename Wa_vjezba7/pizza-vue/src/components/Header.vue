<template>
  <header class="w-full border-b border-slate-200 bg-slate-700 backdrop-blur-sm">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
     
      <router-link to="/" class="flex items-center gap-2 hover:opacity-80 transition">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 shadow-sm">
          <img
            src="https://png.pngtree.com/png-clipart/20250703/original/pngtree-pizza-logo-transparent-image-free-for-online-download-png-image_21265162.png"
            alt="Logo"
            class="h-5 w-5 object-contain"
          />
        </div>
        <div class="flex flex-col leading-tight">
          <span class="text-sm font-semibold tracking-wide text-slate-200 uppercase">Pizza app</span>
          <span class="text-[11px] text-slate-200">Fresh • Fast • Hot</span>
        </div>
      </router-link>
      
      <div class="hidden text-right text-xs leading-snug text-slate-200 sm:block">
        <div class="font-medium text-slate-200">Negrijeva 6</div>
        <div class="text-[11px] text-slate-200">52100 Pula</div>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-right">
          <div class="text-sm font-semibold text-orange-400">{{ korisnicko_ime }}</div>
          
          <div class="flex gap-2 mt-2">
            <router-link 
              to="/moje-narudzbe"
              class="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-all"
            >
              Moje narudžbe
            </router-link>
            
            <button
              @click="$emit('logout')"
              class="text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded transition-all"
            >
              Odjava
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  korisnicko_ime: {
    type: String,
    required: true
  }
})

defineEmits(['logout'])
</script>