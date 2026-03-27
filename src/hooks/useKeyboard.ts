import { useEffect } from 'react'

type KeyCombo = {
  key: string
  ctrl?: boolean
  shift?: boolean
  meta?: boolean
  handler: () => void
}

export function useKeyboard(combos: KeyCombo[]) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      for (const combo of combos) {
        const ctrlMatch = combo.ctrl ? (e.ctrlKey || e.metaKey) : true
        const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey || !combo.shift
        const metaMatch = combo.meta ? e.metaKey : true
        if (
          e.key.toLowerCase() === combo.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          metaMatch
        ) {
          e.preventDefault()
          combo.handler()
          return
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [combos])
}
