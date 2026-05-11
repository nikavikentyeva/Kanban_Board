<template>
  <div id="app">
    <header class="app-header">
      <h1>Kanban Board</h1>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
// App root
</script>

<style scoped>
.app-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.app-main {
  padding: 1.5rem 2rem;
}
</style>
