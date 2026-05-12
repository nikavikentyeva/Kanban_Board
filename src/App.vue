<script setup lang="ts">
// App root
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="app-header__inner">
        <div class="app-header__logo">
          <span class="app-header__icon">◼</span>
          <h1 class="app-header__title">Kanban Board</h1>
        </div>
        <div class="app-header__actions">
          <button class="app-header__btn">Настройки</button>
          <button class="app-header__btn app-header__btn--primary">Новая задача</button>
        </div>
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  flex-shrink: 0;
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-header__icon {
  font-size: 18px;
  color: var(--color-accent);
}

.app-header__title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-header__btn {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: border-color 0.15s, background 0.15s;
}

.app-header__btn:hover {
  border-color: var(--color-border-hover);
  background: #f9fafb;
}

.app-header__btn--primary {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}

.app-header__btn--primary:hover {
  background: var(--color-accent-hover);
  border-color: var(--color-accent-hover);
}

.app-main {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
