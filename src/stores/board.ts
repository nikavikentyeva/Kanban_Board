import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBoardStore = defineStore('board', () => {
  const title = ref('Моя доска')

  function setTitle(newTitle: string) {
    title.value = newTitle
  }

  return { title, setTitle }
});
