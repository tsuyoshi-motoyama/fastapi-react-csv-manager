import { UnauthorizedError } from '../api/client'

export function useApiError(onLogout: () => void) {
  return (error: unknown, fallbackMessage: string): string => {
    if (error instanceof UnauthorizedError) {
      onLogout()
      return ''
    }

    console.error(error)
    return fallbackMessage
  }
}