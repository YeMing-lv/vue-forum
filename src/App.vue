<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
    <div class="app">
        <RouterView />
    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
}

.app {
    display: flex;
    min-height: 100vh;
}

.container {
  position: relative;
  max-width: 1050px;
  margin: 0 auto;
  padding: 0 20px;
}

.aside {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    min-width: 250px;
}
</style>
