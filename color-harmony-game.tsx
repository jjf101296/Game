"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ColorTile {
  id: number
  color: string
  matched: boolean
}

interface ColorHarmonyGameProps {
  onBack: () => void
}

const COLORS = [
  "#FF6B9D",
  "#C44569",
  "#F8B500",
  "#FF7675",
  "#74B9FF",
  "#0984E3",
  "#00B894",
  "#00CEC9",
  "#A29BFE",
  "#6C5CE7",
  "#FD79A8",
  "#E84393",
]

export default function ColorHarmonyGame({ onBack }: ColorHarmonyGameProps) {
  const [tiles, setTiles] = useState<ColorTile[]>([])
  const [selectedTiles, setSelectedTiles] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [moves, setMoves] = useState(0)
  const [maxMoves, setMaxMoves] = useState(20)

  const generateTiles = useCallback((level: number) => {
    const pairCount = Math.min(6 + level, 12) // Start with 6 pairs, max 12
    const selectedColors = COLORS.slice(0, pairCount)
    const allTiles: ColorTile[] = []

    selectedColors.forEach((color, index) => {
      // Create pairs
      allTiles.push({ id: index * 2, color, matched: false }, { id: index * 2 + 1, color, matched: false })
    })

    // Shuffle tiles
    for (let i = allTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[allTiles[i], allTiles[j]] = [allTiles[j], allTiles[i]]
    }

    return allTiles
  }, [])

  const startGame = () => {
    const newTiles = generateTiles(level)
    setTiles(newTiles)
    setSelectedTiles([])
    setScore(0)
    setLevel(1)
    setMoves(0)
    setMaxMoves(20)
    setGameActive(true)
    setGameOver(false)
  }

  const selectTile = (tileId: number) => {
    if (!gameActive) return

    const tile = tiles.find((t) => t.id === tileId)
    if (!tile || tile.matched || selectedTiles.includes(tileId)) return

    const newSelected = [...selectedTiles, tileId]
    setSelectedTiles(newSelected)

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1)

      const [firstId, secondId] = newSelected
      const firstTile = tiles.find((t) => t.id === firstId)
      const secondTile = tiles.find((t) => t.id === secondId)

      if (firstTile && secondTile && firstTile.color === secondTile.color) {
        // Match found!
        setTimeout(() => {
          setTiles((prev) => prev.map((t) => (t.id === firstId || t.id === secondId ? { ...t, matched: true } : t)))
          setScore((prev) => prev + 50)
          setSelectedTiles([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setSelectedTiles([])
        }, 1000)
      }
    }
  }

  // Check win condition
  useEffect(() => {
    if (gameActive && tiles.length > 0 && tiles.every((tile) => tile.matched)) {
      // Level completed!
      setTimeout(() => {
        setLevel((prev) => prev + 1)
        setMaxMoves((prev) => prev + 5)
        const newTiles = generateTiles(level + 1)
        setTiles(newTiles)
        setSelectedTiles([])
        setScore((prev) => prev + 100) // Bonus for completing level
      }, 1000)
    }
  }, [tiles, gameActive, level, generateTiles])

  // Check lose condition
  useEffect(() => {
    if (gameActive && moves >= maxMoves && !tiles.every((tile) => tile.matched)) {
      setGameActive(false)
      setGameOver(true)
    }
  }, [moves, maxMoves, tiles, gameActive])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-2">
            <Button variant="outline" size="sm" onClick={onBack}>
              ← Back
            </Button>
            <CardTitle className="text-xl font-bold">🌈 Color Harmony</CardTitle>
            <div></div>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">Score: {score}</Badge>
            <Badge variant="secondary">Level: {level}</Badge>
            <Badge variant={moves >= maxMoves - 3 ? "destructive" : "secondary"}>
              Moves: {moves}/{maxMoves}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!gameActive && !gameOver && (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                🎨 Match pairs of colors! Find all matching tiles before you run out of moves.
              </p>
              <Button onClick={startGame} className="w-full bg-pink-500 hover:bg-pink-600">
                Start Creating
              </Button>
            </div>
          )}

          {gameOver && (
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Beautiful Work! ✨</h3>
              <p className="text-gray-600">Final Score: {score}</p>
              <p className="text-gray-600">Level Reached: {level}</p>
              <Button onClick={startGame} className="w-full bg-pink-500 hover:bg-pink-600">
                Create Again
              </Button>
            </div>
          )}

          {gameActive && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 p-2">
                {tiles.map((tile) => {
                  const isSelected = selectedTiles.includes(tile.id)
                  const isMatched = tile.matched

                  return (
                    <button
                      key={tile.id}
                      className={`
                        aspect-square rounded-lg border-2 transition-all duration-300 transform
                        ${
                          isMatched
                            ? "opacity-50 scale-95 border-green-400"
                            : isSelected
                              ? "scale-110 border-white shadow-lg"
                              : "border-gray-300 hover:scale-105"
                        }
                        ${!isMatched && !isSelected ? "active:scale-95" : ""}
                      `}
                      style={{
                        backgroundColor: isMatched || isSelected ? tile.color : "#f3f4f6",
                      }}
                      onClick={() => selectTile(tile.id)}
                      disabled={isMatched}
                    >
                      {isMatched && <span className="text-white text-lg">✨</span>}
                      {isSelected && !isMatched && <span className="text-white text-lg">💖</span>}
                    </button>
                  )
                })}
              </div>

              <div className="text-center text-sm text-gray-600">
                {selectedTiles.length === 0 && "Tap tiles to reveal colors!"}
                {selectedTiles.length === 1 && "Find the matching color!"}
                {selectedTiles.length === 2 && "Checking match..."}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
