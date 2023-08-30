import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import { UserContext } from './components/UserContext'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import accountsService from './services/accounts'
import React, { useState, useEffect } from 'react'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const logged = window.localStorage.getItem('logged')
    if (logged) {
      const user = JSON.parse(logged)
      setUser(user)
      accountsService.setToken(user.token)
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={<Home />}
          />
          <Route
            exact
            path="/Game"
            element={<Game />}
          />
          <Route
            exact
            path="/Signin"
            element={<Signin />}
          />
          <Route
            exact
            path="/Signup"
            element={<Signup />}
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  )
}

export default App
