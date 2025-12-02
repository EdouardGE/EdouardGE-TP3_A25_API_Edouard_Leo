// src/stores/user.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
  const users = ref([])
  const API = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000'
  const authStore = useAuthStore()

  async function fetchUsers() {
    try {
      const response = await fetch(`${API}/api/users`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Erreur lors du chargement des utilisateurs')
      }
      const data = await response.json()
      users.value = data
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function fetchUser(id = null) {
    try {
      const endpoint = id ? `${API}/api/users/${id}` : `${API}/api/users/profile`
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Erreur lors de la récupération de l’utilisateur')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function updateUser(id, updatePayload) {
    try {
      const endpoint = id ? `${API}/api/users/${id}` : `${API}/api/users/profile`
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(updatePayload)
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Erreur lors de la mise à jour de l’utilisateur')
      }
      const data = await response.json()
      if (id) {
        const index = users.value.findIndex(u => u._id === id)
        if (index !== -1) users.value[index] = data
      }
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function deleteUser(id = null) {
    try {
      const endpoint = id ? `${API}/api/users/${id}` : `${API}/api/users/profile`
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Erreur lors de la suppression de l’utilisateur')
      }
      // Mettre à jour la liste locale
      if (id) {
        users.value = users.value.filter(u => u._id !== id)
      }
      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  return {
    users,
    fetchUsers,
    fetchUser,
    updateUser,
    deleteUser
  }
})
