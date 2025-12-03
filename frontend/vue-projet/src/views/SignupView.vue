<script setup>

import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')

const loading = ref(false)
const errorMessage = ref('')

const signup = async () => {
    errorMessage.value = null
    loading.value = true

    try {
        await authStore.signup(username.value, password.value, firstName.value, lastName.value, email.value)
        router.push({ name: 'home' })
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        loading.value = false
    }
}

</script>

<template>
  <div class="signup-page">
    <h1>Inscription</h1>

    <form @submit.prevent="signup">

      <div>
        <label>Nom d'utilisateur</label>
        <input v-model="username" type="text" required />
      </div>

      <div>
        <label>Mot de passe</label>
        <input v-model="password" type="password" required />
      </div>

      <div>
        <label>Prénom</label>
        <input v-model="firstName" type="text" required />
      </div>

      <div>
        <label>Nom</label>
        <input v-model="lastName" type="text" required />
      </div>

      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Inscription..." : "S'inscrire" }}
      </button>

      <p v-if="errorMessage" style="color:red;">
        {{ errorMessage }}
      </p>

    </form>
  </div>
</template>

<style scoped>
.signup-page {
  max-width: 350px;
  margin: auto;
}
</style>