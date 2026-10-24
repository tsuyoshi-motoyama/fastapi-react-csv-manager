export type AuthenticatedProps = {
  token: string
  onLogout: () => void
}

export type LoginResponse = {
  access_token: string
}