import { useState } from 'react'

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
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        setMessage('ログインに失敗しました')
        return
      }

      const data = await response.json()

      onLogin(data.access_token)
      console.log('JWT:', data.access_token)
      setMessage('ログイン成功')
    } catch {
      setMessage('通信エラーが発生しました')
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