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

  const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000'

  async function login(email, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
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

  async function signup(username, password, first_name, last_name, email) {
    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({ username: username, password: password, first_name: first_name, last_name: last_name, email: email })
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur inconnue');
      }

      return await response.json()

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
    signup,
    logout
  }
})