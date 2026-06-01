<script setup lang="ts">
const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<{
  clear: []
}>()

function handleClear() {
  modelValue.value = ''
  emit('clear')
}
</script>

<template>
  <div class="search-input-wrapper">
    <svg
      class="search-icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      width="16"
      height="16"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
    <input
      v-model="modelValue"
      type="text"
      placeholder="Поиск по задачам..."
      class="search-input"
    />
    <button
      v-if="modelValue"
      class="search-clear"
      title="Очистить"
      @click="handleClear"
    >
      ×
    </button>
  </div>
</template>

<style scoped lang="scss">
.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 7px 28px 7px 34px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  background: var(--color-surface);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
}

.search-clear {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--color-text-muted);
  background: transparent;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  &:hover {
    background: #f3f4f6;
    color: var(--color-text-primary);
  }
}
</style>
