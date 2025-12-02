<template>
  <nav class="d-flex align-items-center mt-2 mt-md-0">
    <h1 class="m-0 me-4" style="font-size: 1.5rem;">Librairie Kaneto</h1>
    <div class="d-flex">
      <router-link to="/" class="me-3 py-2 d-inline-block">Livres</router-link>
      <router-link :to="{ name: 'about' }" class="py-2 d-inline-block">À propos</router-link>
    </div>
  </nav>
</template>
