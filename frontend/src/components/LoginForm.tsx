import { useState } from 'react'
import { login } from '../api/auth'
import { UnauthorizedError } from '../api/client'

type LoginFormProps = {
  onLogin: (token: string) => void
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')

    try {
      const data = await login(email, password)

      onLogin(data.access_token)
      setMessage('ログイン成功')
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setMessage('ログインに失敗しました')
      } else if (error instanceof TypeError) {
        setMessage('通信エラーが発生しました')
      } else {
        setMessage('ログインに失敗しました')
      }
    }
  }

  return (
    <div>
      <h2>ログイン</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">ログイン</button>
      </form>

      <p>{message}</p>
    </div>
  )
}

export default LoginForm