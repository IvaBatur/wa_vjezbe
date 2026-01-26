<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import LoginRegister from './components/LogIn.vue'

const jePrijavljen = ref(false)
const korisnicko_ime = ref('')

onMounted(() => {
  const token = localStorage.getItem('jwt_token')
  const ime = localStorage.getItem('korisnicko_ime')
  
  if (token && ime) {
    jePrijavljen.value = true
    korisnicko_ime.value = ime
  }
})

function handleLoginSuccess(korisnik) {
  jePrijavljen.value = true
  korisnicko_ime.value = korisnik.korisnicko_ime
}

function odjavi() {
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('korisnicko_ime')
  jePrijavljen.value = false
  korisnicko_ime.value = ''
}
</script>

<template>
  <div>
    <LoginRegister 
      v-if="!jePrijavljen"
      @login-success="handleLoginSuccess"
    />
    
    <div v-else>
      <Header :korisnicko-ime="korisnicko_ime" @logout="odjavi" />
      <router-view />
    </div>
  </div>
</template>