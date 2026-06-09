import { describe, it, expect, beforeEach } from 'vitest'
import { useHistory } from '@/composables/useHistory'
import type { BoardState } from '@/composables/useBoardStorage'

function makeState(title: string): BoardState {
  return {
    board: { title },
    columns: [],
    tasks: {},
  }
}

describe('useHistory', () => {
  beforeEach(() => {
    const { clear } = useHistory()
    clear()
  })

  it('records state and allows undo', () => {
    const { record, undo, canUndo } = useHistory()

    record(makeState('First'))
    record(makeState('Second'))

    expect(canUndo.value).toBe(true)

    const state = undo()
    expect(state).not.toBeNull()
    expect(state!.board.title).toBe('First')
  })

  it('allows redo after undo', () => {
    const { record, undo, redo, canRedo } = useHistory()

    record(makeState('First'))
    record(makeState('Second'))

    undo()
    expect(canRedo.value).toBe(true)

    const state = redo()
    expect(state).not.toBeNull()
    expect(state!.board.title).toBe('Second')
  })

  it('clears future on new record after undo', () => {
    const { record, undo, redo, canRedo } = useHistory()

    record(makeState('First'))
    record(makeState('Second'))
    undo()

    record(makeState('Third'))
    expect(canRedo.value).toBe(false)
    expect(redo()).toBeNull()
  })

  it('does not record duplicate state', () => {
    const { record, undo, canUndo } = useHistory()

    record(makeState('Same'))
    record(makeState('Same'))

    expect(canUndo.value).toBe(false)
    expect(undo()).toBeNull()
  })

  it('limits history to 20 states', () => {
    const { record, undo } = useHistory()

    for (let i = 0; i < 25; i++) {
      record(makeState(`State ${i}`))
    }

    let lastState = makeState('')
    for (let i = 0; i < 19; i++) {
      const s = undo()
      expect(s).not.toBeNull()
      lastState = s!
    }

    expect(lastState.board.title).toBe('State 5')
  })

  it('returns null for undo when no history', () => {
    const { undo } = useHistory()
    expect(undo()).toBeNull()
  })

  it('returns null for redo when no future', () => {
    const { record, redo } = useHistory()
    record(makeState('Only'))
    expect(redo()).toBeNull()
  })
})
