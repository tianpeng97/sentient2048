import React, { useState } from 'react'
import Header from '../components/Header'
import RegisterForm from '../components/RegisterForm'
import loginService from '../services/login'
import accountsService from '../services/accounts'
import { UserContext } from '../components/UserContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleRegister = async (event) => {
    event.preventDefault()

    try {
      if (password === newPassword) {
        await accountsService.create({ username, password })
        const user = await loginService.login({ username, password })
        window.localStorage.setItem('logged', JSON.stringify(user))

        accountsService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
        setNewPassword('')
        navigate('/game')
      } else {
        throw new Error('Password and repeat password fields not same value.')
      }
    } catch (exception) {}
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <RegisterForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        handleRegister={handleRegister}
      />
    </div>
  )
}

export default Signin
