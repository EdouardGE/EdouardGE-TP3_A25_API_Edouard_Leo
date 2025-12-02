import { defineStore } from 'pinia'
import { jwtDecode } from "jwt-decode";
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);

  const isAuthenticated = computed(() => {
    if (token.value) {
      const decoded = jwtDecode(token.value)
      const now = Date.now() / 1000
      return decoded.exp >= now
    }
    return false
  })

  const API = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000'

  async function login(username, password) {
    try {
      const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: username, password })
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur inconnue');
      }

      const data = await response.json()
      token.value = data.token

      localStorage.setItem('token', data.token);
    } catch (error) {
      console.log("erreur: ", error)
      throw error;
    }
  }

  function logout() {
    token.value = null
    localStorage.removeItem('token');
  }

  return {
    token,
    isAuthenticated,
    login,
    logout
  }
})