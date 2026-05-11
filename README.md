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

Проект построен по **feature-based** структуре:

```
src/
├── features/
│   ├── board/          # Доска
│   ├── column/         # Колонки
│   └── task/           # Задачи
├── shared/             # Переиспользуемые компоненты и утилиты
├── stores/             # Глобальные store (pinia)
├── types/              # Глобальные TypeScript типы
├── composables/        # Переиспользуемая логика
└── router/             # Vue Router
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

## Автор

[Твоё имя]
