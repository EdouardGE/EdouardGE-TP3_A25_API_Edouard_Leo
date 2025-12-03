<script setup>

import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const loading = ref(false)
const errorMessage = ref('')

const login = async () => {
    errorMessage.value = null
    loading.value = true

    try {
        await authStore.login(email.value, password.value)
        router.push({ name: 'home' })
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        loading.value = false
    }
}

</script>

<template>
  <div class="login-page">
    <h1>Connexion</h1>

    <form @submit.prevent="login">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Mot de passe</label>
        <input v-model="password" type="password" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Connexion..." : "Se connecter" }}
      </button>

      <p v-if="errorMessage" style="color:red;">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  max-width: 350px;
  margin: auto;
}
</style>