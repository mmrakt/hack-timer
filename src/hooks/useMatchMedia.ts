import { useCallback, useMemo, useSyncExternalStore } from 'react'

// https://zenn.dev/stin/articles/use-sync-external-store-with-match-media
export const useMatchMedia = (
  mediaQuery: string,
  initialState = false
): boolean => {
  const matchmediaList = useMemo(
    () =>
      typeof window === 'undefined' ? undefined : window.matchMedia(mediaQuery),
    [mediaQuery]
  )

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      matchmediaList?.addEventListener('change', onStoreChange)
      return () => matchmediaList?.removeEventListener('change', onStoreChange)
    },
    [matchmediaList]
  )

  return useSyncExternalStore(
    subscribe,
    () => matchmediaList?.matches ?? initialState,
    () => initialState
  )
}
