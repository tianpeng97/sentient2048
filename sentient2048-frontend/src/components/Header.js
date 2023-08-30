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
          <div className="flex-1"></div>
          <nav className="lg:flex items-center space-x-4">
            <Link to="/game">
              <Button text="Try it" />
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
