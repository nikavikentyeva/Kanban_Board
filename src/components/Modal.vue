<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

export interface ModalProps {
  open: boolean
}

export interface ModalEmits {
  close: []
}

const props = defineProps<ModalProps>()
const emit = defineEmits<ModalEmits>()

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal"
        @click.self="emit('close')"
      >
        <div class="modal__content">
          <button
            class="modal__close"
            aria-label="Закрыть"
            @click="emit('close')"
          >
            <span class="modal__close-icon">×</span>
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 24px;

  &__content {
    position: relative;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 480px;
    padding: 24px;
  }

  &__close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--color-text-muted);
    transition: color 0.15s, background 0.15s;

    &:hover {
      color: var(--color-text-primary);
      background: #f3f4f6;
    }
  }

  &__close-icon {
    font-size: 22px;
    line-height: 1;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
