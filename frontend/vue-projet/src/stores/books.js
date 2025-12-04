// src/stores/book.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useBookStore = defineStore('book', () => {
  const books = ref([])
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  const authStore = useAuthStore()
  const bookCount = computed(() => books.value.length)

  async function fetchBooks(page = 1, limit = 4) {
    try {
      const response = await fetch(`${API}/api/livres?page=${page}&limit=${limit}`)
      if (!response.ok) throw new Error('Erreur lors du chargement des livres')
      const data = await response.json()
      books.value = data.data
      return data.pagination
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function searchBooks(query) {
    if (!query) return []
    try {
      const response = await fetch(`${API}/api/livres/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Erreur lors de la recherche de livres')
      const data = await response.json()
      books.value = data
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function addBook(payload) {
    try {
      const response = await fetch(`${API}/api/livres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l’ajout du livre')
      }
      books.value.push(data)
      return data

    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function updateBook(id, updatePayload) {
    try {
      const response = await fetch(`${API}/api/livres/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(updatePayload)
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Erreur lors de la mise à jour du livre')
      }
      const updatedBook = await response.json()
      const index = books.value.findIndex(b => b._id === id)
      if (index !== -1) books.value[index] = updatedBook
      return updatedBook
    } catch (error) {
      console.error(error)
      throw error
    }
  }


  async function deleteBook(id) {
    try {
      const response = await fetch(`${API}/api/livres/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Erreur lors de la suppression du livre')
      }
      books.value = books.value.filter(b => b._id !== id)
      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    books,
    bookCount,
    fetchBooks,
    searchBooks,
    addBook,
    updateBook,
    deleteBook
  }
})
