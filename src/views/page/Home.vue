<template>
  <div class="home">
    <h1>Bienvenue sur Communities.</h1>
    <p>C'est quoi ?</p>
    <router-link :to="{ name: 'login' }">Me connecter</router-link>
    <router-link :to="{ name: 'dashboard' }">Dashboard</router-link>
  </div>
</template>
