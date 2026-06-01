import { ref, computed, readonly, watch, onScopeDispose, inject, provide, type InjectionKey } from 'vue'

function createSearchState() {
  const query = ref('')
  const debounced = ref('')
  let timeout: ReturnType<typeof setTimeout> | null = null

  const stopWatch = watch(query, (val) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      debounced.value = val.trim().toLowerCase()
    }, 300)
  })

  const clearQuery = () => {
    query.value = ''
    debounced.value = ''
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  const matchesTask = (title: string, description: string) => {
    if (!debounced.value) {
      return true
    }

    return title.toLowerCase().includes(debounced.value) || description.toLowerCase().includes(debounced.value)
  }

  onScopeDispose(() => {
    stopWatch()
    if (timeout) clearTimeout(timeout)
  })

  return {
    searchQuery: query,
    debouncedQuery: readonly(debounced),
    clearQuery,
    matchesTask,
    isSearching: computed(() => debounced.value.length > 0),
  }
}

export type SearchState = ReturnType<typeof createSearchState>

export const SearchKey: InjectionKey<SearchState> = Symbol('search')

/**
 * Возвращает instance поиска из дерева компонентов.
 * Требует предварительного provide(SearchKey, instance) выше по дереву.
 */
export function useSearch(): SearchState {
  const state = inject(SearchKey)
  if (!state) {
    throw new Error(
      '[useSearch] No search provider found. Call provideSearch() in a parent component.'
    )
  }
  return state
}

/**
 * Создаёт instance поиска и предоставляет его в дерево компонентов.
 * Используется в корневом компоненте (App.vue).
 */
export function provideSearch(): SearchState {
  const state = createSearchState()
  provide(SearchKey, state)
  return state
}
