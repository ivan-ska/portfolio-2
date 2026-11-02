import { useCallback, useSyncExternalStore } from 'react'

// Совпадает ли сейчас медиазапрос, например '(hover: hover)'.
// Обновляется сам, если условие меняется (подключили мышь к планшету и т.п.).
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', callback)
      return () => list.removeEventListener('change', callback)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}
