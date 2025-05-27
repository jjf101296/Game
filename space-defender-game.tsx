"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Asteroid {
  id: number
  x: number
  y: number
  speed: number
  size: number
}

interface SpaceDefenderGameProps {
  onBack: () => void
}

export default function SpaceDefenderGame({ onBack }: SpaceDefenderGameProps) {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(1)
  const [nextAsteroidId, setNextAsteroidId] = useState(1)

  const spawnAsteroid = useCallback(() => {
    if (!gameActive) return

    const gameArea = document.getElementById("space-game-area")
    if (!gameArea) return

    const rect = gameArea.getBoundingClientRect()
    const size = Math.random() * 30 + 20 // Random size between 20-50
    const x = Math.random() * (rect.width - size)
    const speed = Math.random() * 2 + 1 + level * 0.5 // Faster as level increases

    const newAsteroid: Asteroid = {
      id: nextAsteroidId,
      x,
      y: -size,
      speed,
      size,
    }

    setAsteroids((prev) => [...prev, newAsteroid])
    setNextAsteroidId((prev) => prev + 1)
  }, [gameActive, level, nextAsteroidId])

  const shootAsteroid = (asteroidId: number) => {
    setAsteroids((prev) => prev.filter((asteroid) => asteroid.id !== asteroidId))
    setScore((prev) => prev + 15)

    // Level up every 150 points
    if ((score + 15) % 150 === 0) {
      setLevel((prev) => prev + 1)
    }
  }

  const startGame = () => {
    setScore(0)
    setLives(3)
    setLevel(1)
    setAsteroids([])
    setGameActive(true)
    setGameOver(false)
    setNextAsteroidId(1)
  }

  const endGame = () => {
    setGameActive(false)
    setGameOver(true)
    setAsteroids([])
  }

  // Game loop
  useEffect(() => {
    if (!gameActive) return

    const gameLoop = setInterval(() => {
      setAsteroids((prev) => {
        const gameArea = document.getElementById("space-game-area")
        if (!gameArea) return prev

        const rect = gameArea.getBoundingClientRect()

        const updated = prev.map((asteroid) => ({
          ...asteroid,
          y: asteroid.y + asteroid.speed,
        }))

        // Remove asteroids that reached the bottom and lose lives
        const escaped = updated.filter((asteroid) => asteroid.y > rect.height)
        if (escaped.length > 0) {
          setLives((currentLives) => {
            const newLives = currentLives - escaped.length
            if (newLives <= 0) {
              setTimeout(endGame, 100)
              return 0
            }
            return newLives
          })
        }

        return updated.filter((asteroid) => asteroid.y <= rect.height)
      })
    }, 50)

    return () => clearInterval(gameLoop)
  }, [gameActive])

  // Spawn asteroids
  useEffect(() => {
    if (!gameActive) return

    const spawnInterval = Math.max(500, 1200 - (level - 1) * 100)

    const spawnTimer = setInterval(() => {
      if (asteroids.length < 5) {
        spawnAsteroid()
      }
    }, spawnInterval)

    return () => clearInterval(spawnTimer)
  }, [gameActive, level, asteroids.length, spawnAsteroid])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-2">
            <Button variant="outline" size="sm" onClick={onBack}>
              ← Back
            </Button>
            <CardTitle className="text-xl font-bold">🚀 Space Defender</CardTitle>
            <div></div>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">Score: {score}</Badge>
            <Badge variant="secondary">Level: {level}</Badge>
            <Badge variant={lives <= 1 ? "destructive" : "secondary"}>Lives: {lives}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!gameActive && !gameOver && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">🛸 Defend Earth from asteroids! Tap them before they reach the bottom!</p>
              <Button onClick={startGame} className="w-full bg-blue-600 hover:bg-blue-700">
                Launch Mission
              </Button>
            </div>
          )}

          {gameOver && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Mission Failed! 💥</h3>
              <p className="text-gray-600">Final Score: {score}</p>
              <p className="text-gray-600">Level Reached: {level}</p>
              <Button onClick={startGame} className="w-full bg-blue-600 hover:bg-blue-700">
                Retry Mission
              </Button>
            </div>
          )}

          {gameActive && (
            <div
              id="space-game-area"
              className="relative w-full h-96 bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden touch-none"
              style={{ userSelect: "none" }}
            >
              {/* Stars background */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  />
                ))}
              </div>

              {asteroids.map((asteroid) => (
                <button
                  key={asteroid.id}
                  className="absolute rounded-full bg-gradient-to-r from-orange-500 to-red-600 border-2 border-yellow-400 shadow-lg transition-all duration-75 active:scale-90"
                  style={{
                    left: asteroid.x,
                    top: asteroid.y,
                    width: asteroid.size,
                    height: asteroid.size,
                  }}
                  onClick={() => shootAsteroid(asteroid.id)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    shootAsteroid(asteroid.id)
                  }}
                >
                  <span className="text-white font-bold text-xs">💥</span>
                </button>
              ))}

              {/* Spaceship at bottom */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-2xl">🚀</div>

              {asteroids.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Scanning for threats...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
