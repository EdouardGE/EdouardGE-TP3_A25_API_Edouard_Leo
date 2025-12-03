<script setup>

import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const userStore = useUserStore()
const profile = ref(null)
const errorMessage = ref('')

onMounted(async () => {
  try {
    profile.value = await userStore.fetchUser()
  } catch (error) {
    errorMessage.value = error.message
  }
})

</script>

<template>
  <div class="profile-page">
    <h1>Profil</h1>

    <p v-if="errorMessage" style="color:red">{{ errorMessage }}</p>

    <p v-if="!profile">Chargement...</p>

    <div v-else>
      <p><strong>Nom d'utilisateur:</strong> {{ profile.username }}</p>
      <p><strong>Prénom:</strong> {{ profile.first_name }}</p>
      <p><strong>Nom:</strong> {{ profile.last_name }}</p>
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <p><strong>Actif :</strong> {{ profile.is_active ? "Oui" : "Non" }}</p>
      <p><strong>Admin :</strong> {{ profile.is_admin ? "Oui" : "Non" }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>