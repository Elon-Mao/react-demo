import { useState, useRef, useCallback } from 'react'
import { enablePatches, Draft, produceWithPatches, applyPatches, Patch, Objectish } from 'immer'

export declare type UpdateFunction<S> = (recipe: (draft: Draft<S>) => void) => void
export declare type UndoRedoHook<S> = [S, UpdateFunction<S>, () => void, () => void]

enablePatches()

const useUndoRedo = <S extends Objectish>(
  initialValue: S,
  maxStep = 128
): UndoRedoHook<S> => {
  const [state, setState] = useState(initialValue)
  const stateRef = useRef(state)
  stateRef.current = state
  const _currentStep = useRef(0)
  const _maxStep = useRef(maxStep)
  const _changes = useRef<Patch[][]>([])
  const _inverseChanges = useRef<Patch[][]>([])

  const updater: UpdateFunction<S> = useCallback((draft) => {
    const [nextState, patches, inversePatches] = produceWithPatches<S>(stateRef.current, draft)
    if (patches.length === 0) {
      return
    }
    _changes.current.splice(_currentStep.current)
    _changes.current.push(patches)
    _inverseChanges.current.splice(_currentStep.current++)
    _inverseChanges.current.push(inversePatches)
    if (_currentStep.current > _maxStep.current) {
      _changes.current.shift()
      _inverseChanges.current.shift()
      _currentStep.current--
    }
    setState(nextState)
  }, [])

  const undo = useCallback(() => {
    if (_currentStep.current === 0) {
      return
    }
    const inverseChanges = _inverseChanges.current[--_currentStep.current]
    setState(applyPatches(stateRef.current, inverseChanges))
  }, [])

  const redo = useCallback(() => {
    if (_currentStep.current >= _changes.current.length) {
      return
    }
    const changes = _changes.current[_currentStep.current++]
    setState(applyPatches(stateRef.current, changes))
  }, [])
  return [state, updater, undo, redo]
}

export { useUndoRedo }