import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Article from '../components/Article'
import Paragraph from '../components/Paragraph'
import Copy from '../Copy'
import Button from '../components/Button'
import { UserContext } from '../components/UserContext'

const Home = () => {
  const { user } = useContext(UserContext)
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col sm:grid sm:grid-cols-[1fr,5fr] w-full">
        <Article
          alt={false}
          title="Welcome"
          content={<Paragraph content={Copy.welcomeContent} />}
        />
        <Article
          alt={true}
          title="How to play"
          content={<Paragraph content={Copy.howToContent} />}
        />
        <Article
          alt={false}
          title="Try the game out"
          content={
            <nav className="h-full lg:flex items-center space-x-4 pt-6 px-6">
              <Link to="/game">
                <Button text="Game" />
              </Link>
            </nav>
          }
        />
      </div>
    </div>
  )
}

export default Home
