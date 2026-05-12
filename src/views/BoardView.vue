<script setup lang="ts">
import Board from '@/components/Board.vue'
import Column from '@/components/Column.vue'
import Card from '@/components/Card.vue'
import AddColumnButton from '@/components/AddColumnButton.vue'
</script>

<template>
  <Board title="Моя доска" :columns-count="3">
    <Column title="Сделать" :count="2" @add-task="">
      <Card
        title="Добавить авторизацию"
        description="Реализовать вход через OAuth"
      />
      <Card title="Настроить CI/CD" />
    </Column>

    <Column title="В процессе" :count="1" @add-task="">
      <Card
        title="Верстка Kanban-доски"
      />
    </Column>

    <Column title="Готово" :count="0" @add-task="">
      <!-- пустая колонка -->
    </Column>

    <AddColumnButton @click="" />
  </Board>
</template>

<style scoped lang="scss">
/* BoardView styles */
</style>
