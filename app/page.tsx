"use client"

import { useState } from "react"
import WelcomeScreen from "../welcome-screen"
import SpaceDefenderGame from "../space-defender-game"
import ColorHarmonyGame from "../color-harmony-game"

type GameState = "welcome" | "boy" | "girl"

export default function Page() {
  const [currentGame, setCurrentGame] = useState<GameState>("welcome")

  const handleGenderSelect = (gender: "boy" | "girl") => {
    setCurrentGame(gender)
  }

  const handleBack = () => {
    setCurrentGame("welcome")
  }

  if (currentGame === "welcome") {
    return <WelcomeScreen onGenderSelect={handleGenderSelect} />
  }

  if (currentGame === "boy") {
    return <SpaceDefenderGame onBack={handleBack} />
  }

  if (currentGame === "girl") {
    return <ColorHarmonyGame onBack={handleBack} />
  }

  return null
}
