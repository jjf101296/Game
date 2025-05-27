"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Circle {
  id: number
  x: number
  y: number
  timeLeft: number
  maxTime: number
}

export default function TapCircleGame() {
  const [circles, setCircles] = useState<Circle[]>([])
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [level, setLevel] = useState(1)
  const [nextCircleId, setNextCircleId] = useState(1)

  const spawnCircle = useCallback(() => {
    if (!gameActive) return

    const gameArea = document.getElementById("game-area")
    if (!gameArea) return

    const rect = gameArea.getBoundingClientRect()
    const circleSize = 60
    const margin = circleSize / 2

    const x = Math.random() * (rect.width - circleSize) + margin
    const y = Math.random() * (rect.height - circleSize) + margin

    const baseTime = Math.max(1000, 2500 - (level - 1) * 100) // Faster as level increases

    const newCircle: Circle = {
      id: nextCircleId,
      x,
      y,
      timeLeft: baseTime,
      maxTime: baseTime,
    }

    setCircles((prev) => [...prev, newCircle])
    setNextCircleId((prev) => prev + 1)
  }, [gameActive, level, nextCircleId])

  const tapCircle = (circleId: number) => {
    setCircles((prev) => prev.filter((circle) => circle.id !== circleId))
    setScore((prev) => prev + 10)

    // Level up every 100 points
    if ((score + 10) % 100 === 0) {
      setLevel((prev) => prev + 1)
    }
  }

  const startGame = () => {
    setScore(0)
    setLives(3)
    setLevel(1)
    setCircles([])
    setGameActive(true)
    setGameOver(false)
    setNextCircleId(1)
  }

  const endGame = () => {
    setGameActive(false)
    setGameOver(true)
    setCircles([])
  }

  // Game loop
  useEffect(() => {
    if (!gameActive) return

    const gameLoop = setInterval(() => {
      // Update circle timers
      setCircles((prev) => {
        const updated = prev.map((circle) => ({
          ...circle,
          timeLeft: circle.timeLeft - 50,
        }))

        // Remove expired circles and lose lives
        const expired = updated.filter((circle) => circle.timeLeft <= 0)
        if (expired.length > 0) {
          setLives((currentLives) => {
            const newLives = currentLives - expired.length
            if (newLives <= 0) {
              setTimeout(endGame, 100)
              return 0
            }
            return newLives
          })
        }

        return updated.filter((circle) => circle.timeLeft > 0)
      })
    }, 50)

    return () => clearInterval(gameLoop)
  }, [gameActive])

  // Spawn circles
  useEffect(() => {
    if (!gameActive) return

    const spawnInterval = Math.max(800, 1500 - (level - 1) * 50) // Spawn faster as level increases

    const spawnTimer = setInterval(() => {
      if (circles.length < 3) {
        // Max 3 circles at once
        spawnCircle()
      }
    }, spawnInterval)

    return () => clearInterval(spawnTimer)
  }, [gameActive, level, circles.length, spawnCircle])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Tap the Circle!</CardTitle>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">Score: {score}</Badge>
            <Badge variant="secondary">Level: {level}</Badge>
            <Badge variant={lives <= 1 ? "destructive" : "secondary"}>Lives: {lives}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!gameActive && !gameOver && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Tap the circles before they disappear! You lose a life for each missed circle.
              </p>
              <Button onClick={startGame} className="w-full">
                Start Game
              </Button>
            </div>
          )}

          {gameOver && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Game Over!</h3>
              <p className="text-gray-600">Final Score: {score}</p>
              <p className="text-gray-600">Level Reached: {level}</p>
              <Button onClick={startGame} className="w-full">
                Play Again
              </Button>
            </div>
          )}

          {gameActive && (
            <div
              id="game-area"
              className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden touch-none"
              style={{ userSelect: "none" }}
            >
              {circles.map((circle) => {
                const progress = circle.timeLeft / circle.maxTime
                const scale = 0.5 + progress * 0.5 // Shrink as time runs out
                const opacity = Math.max(0.3, progress) // Fade as time runs out

                return (
                  <button
                    key={circle.id}
                    className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-4 border-white shadow-lg transition-all duration-75 active:scale-90"
                    style={{
                      left: circle.x - 30,
                      top: circle.y - 30,
                      width: 60,
                      height: 60,
                      transform: `scale(${scale})`,
                      opacity: opacity,
                    }}
                    onClick={() => tapCircle(circle.id)}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      tapCircle(circle.id)
                    }}
                  >
                    <span className="text-white font-bold text-sm">TAP</span>
                  </button>
                )
              })}

              {circles.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">Get ready...</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
