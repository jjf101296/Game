"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WelcomeScreenProps {
  onGenderSelect: (gender: "boy" | "girl") => void
}

export default function WelcomeScreen({ onGenderSelect }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            🎮 Welcome to Fun Games! 🎮
          </CardTitle>
          <p className="text-gray-600 mt-2">Choose your adventure!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Select your game:</h3>
          </div>

          <Button
            onClick={() => onGenderSelect("boy")}
            className="w-full h-20 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🚀</span>
              <span>Space Defender</span>
              <span className="text-sm opacity-90">Action & Adventure</span>
            </div>
          </Button>

          <Button
            onClick={() => onGenderSelect("girl")}
            className="w-full h-20 text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl mb-1">🌈</span>
              <span>Color Harmony</span>
              <span className="text-sm opacity-90">Puzzle & Creativity</span>
            </div>
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            Both games are fun for everyone! Choose the theme you like most.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
