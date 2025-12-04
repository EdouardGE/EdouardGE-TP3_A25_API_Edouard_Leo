<script setup>

import { ref, onMounted } from 'vue'
import { useBookStore } from '@/stores/books'
import { useRouter } from 'vue-router'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'


const bookStore = useBookStore()
const router = useRouter()

const titre = ref('')
const auteurs = ref([])
const isbn = ref('')
const prix = ref(null)
const quantite = ref(0)

const auteursList = ref([])

const loading = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  try {
    const res = await fetch(`${API}/api/auteurs`)
    if (!res.ok) throw new Error("Impossible de charger les auteurs")

    auteursList.value = await res.json()
  } catch (err) {
    errorMessage.value = err.message
  }
})

const createBook = async () => {
    errorMessage.value = null
    loading.value = true

    try {

        await bookStore.addBook({
            titre: titre.value,
            auteurs: auteurs.value,
            isbn: isbn.value,
            prix: prix.value,
            quantite: quantite.value
        })

        router.push({ name: 'home' })
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        loading.value = false
    }
}


</script>

<template>
    <div class ="book-create-page">
        <h1>Créer un nouveau livre</h1>

        <form @submit.prevent="createBook">
            <div>
                <label>Titre</label>
                <input v-model="titre" type="text" required />
            </div>

            <div>
                <label>Auteur(s)</label>
                <select v-model="auteurs" multiple required>
                <option
                    v-for="a in auteursList"
                    :key="a._id"
                    :value="a._id">
                    {{ a.nom }}
                </option>
                </select>
            </div>

            <div>
                <label>Prix</label>
                <input v-model.number="prix" type="number" min="0" step="0.01" required />
            </div>

            <div>
                <label>Quantité en stock</label>
                <input v-model.number="quantite" type="number" min="0" />
            </div>

            <div>
                <label>ISBN</label>
                <input v-model="isbn" type="text" required />
            </div>

            <button type="submit" :disabled="loading">
                {{ loading ? "Création..." : "Créer le livre" }}
            </button>

            <p v-if="errorMessage" style="color:red;">
                {{ errorMessage }}
            </p>
        </form>
    </div>
</template>

<style scoped>
.book-create-page {
  max-width: 350px;
  margin: auto;
}
</style>