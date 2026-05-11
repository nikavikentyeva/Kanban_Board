# Kanban Board

Пет-проект для демонстрации навыков Middle+ Frontend разработчика.

## Стек

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript** (strict mode)
- **Vite** (сборка)
- **Pinia** (state management)
- **Vue Router**
- **Vitest** (unit-тесты)

## Архитектура

Классическая структура Vue-приложения:

```
src/
├── assets/           # Статика, стили, изображения
├── components/       # Переиспользуемые Vue-компоненты
├── views/            # Страницы / экраны (привязаны к роутам)
├── services/         # Работа с API и бэкендом
├── stores/           # Pinia store (глобальное состояние)
├── types/            # Глобальные TypeScript типы
├── composables/      # Переиспользуемая логика
├── utils/            # Утилиты и хелперы
├── router/           # Vue Router
├── App.vue           # Корневой компонент
└── main.ts           # Точка входа
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm install` | Установка зависимостей |
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для production |
| `npm run test` | Запуск unit-тестов |

## Что планируется

- [ ] Drag & Drop колонок и задач
- [ ] Optimistic UI + Undo/Redo
- [ ] Offline-first (localStorage / IndexedDB)
- [ ] WebSocket real-time коллаборация
- [ ] Поиск с debounce
- [ ] Экспорт / импорт доски
