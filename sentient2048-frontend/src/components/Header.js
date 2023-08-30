import React, { useContext } from 'react'
import Button from './Button'
import accountsService from '../services/accounts'
import { UserContext } from './UserContext'
import { Link, useNavigate } from 'react-router-dom'

const Header = () => {
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await setUser(null)
    accountsService.removeToken()
    localStorage.removeItem('logged')
    navigate('/')
  }

  return (
    <div className="relative">
      <div className="max-w-full mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center py-4 lg:space-x-10">
          <div className="flex justify-start items-center lg:w-0 lg:flex-1">
            <Link to="/">
              <div className="flex title-font font-medium items-center">
                <span className="ml-2 text-2xl hover:text-slate-100 font-bold">
                  Sentient 2048
                </span>
              </div>
            </Link>
          </div>
          <nav className="lg:flex items-center space-x-4">
            <Link to="/game">
              <Button text="Game" />
            </Link>
            {!user && (
              <Link to="/signin">
                <Button text="Sign In" />
              </Link>
            )}
            {user && (
              <Link>
                <Button
                  text="Signout"
                  onClick={handleLogout}
                />
              </Link>
            )}
            {!user && (
              <Link to="/signup">
                <Button text="Sign Up" />
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Header
