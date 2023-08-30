import React, { useState } from 'react'
import Header from '../components/Header'
import LoginForm from '../components/LoginForm'
import loginService from '../services/login'
import accountsService from '../services/accounts'
import { UserContext } from '../components/UserContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('logged', JSON.stringify(user))

      accountsService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/game')
    } catch (exception) {}
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    </div>
  )
}

export default Signin
