"use client"

import { useEffect, useRef, useState } from "react"

const GRID_SIZE = 20
const TILE_SIZE = 15
const CANVAS_W = GRID_SIZE * TILE_SIZE
const CANVAS_H = GRID_SIZE * TILE_SIZE

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showHint, setShowHint] = useState(true)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext("2d")
    if (!ctx) return

    // Game state
    let gameRunning = false
    let score = 0
    let bestScore = 0
    try {
      const stored = localStorage.getItem("snake-best")
      if (stored) bestScore = parseInt(stored, 10) || 0
    } catch {}

    // Snake array
    let snake = [{ x: 10, y: 10 }]
    let food = { x: 15, y: 15 }
    let direction = { x: 1, y: 0 }
    let nextDirection = { x: 1, y: 0 }

    const generateFood = () => {
      food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
      // Make sure food doesn't spawn on snake
      for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
          generateFood()
          return
        }
      }
    }

    const update = () => {
      if (!gameRunning) return

      direction = nextDirection

      const head = { ...snake[0] }
      head.x += direction.x
      head.y += direction.y

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameRunning = false
        return
      }

      // Self collision
      for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
          gameRunning = false
          return
        }
      }

      snake.unshift(head)

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        score++
        setScore(score)
        if (score > bestScore) {
          bestScore = score
          try {
            localStorage.setItem("snake-best", String(bestScore))
          } catch {}
        }
        generateFood()
      } else {
        snake.pop()
      }
    }

    const draw = () => {
      // Background
      ctx.fillStyle = "#1a1a2e"
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Grid lines (subtle)
      ctx.strokeStyle = "rgba(255, 193, 7, 0.1)"
      ctx.lineWidth = 0.5
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath()
        ctx.moveTo(i * TILE_SIZE, 0)
        ctx.lineTo(i * TILE_SIZE, CANVAS_H)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i * TILE_SIZE)
        ctx.lineTo(CANVAS_W, i * TILE_SIZE)
        ctx.stroke()
      }

      // Snake
      snake.forEach((segment, index) => {
        if (index === 0) {
          // Head - golden glow
          ctx.fillStyle = "#ffc107"
          ctx.shadowColor = "rgba(255, 193, 7, 0.6)"
          ctx.shadowBlur = 8
          ctx.fillRect(segment.x * TILE_SIZE + 1, segment.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2)
          ctx.shadowBlur = 0
        } else {
          // Body - darker golden
          ctx.fillStyle = "#ffb300"
          ctx.fillRect(segment.x * TILE_SIZE + 1, segment.y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2)
        }
      })

      // Food
      ctx.fillStyle = "#ff6b6b"
      ctx.shadowColor = "rgba(255, 107, 107, 0.8)"
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(food.x * TILE_SIZE + TILE_SIZE / 2, food.y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE / 2 - 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Score display
      ctx.fillStyle = "#ffc107"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${score}`, 8, 20)
      ctx.fillText(`Best: ${bestScore}`, 8, 40)
    }

    const gameLoop = () => {
      update()
      draw()
    }

    const intervalId = window.setInterval(gameLoop, 100)

    const onKey = (e: KeyboardEvent) => {
      if (!gameRunning) {
        if (e.code === "Space" || e.keyCode === 32) {
          e.preventDefault()
          gameRunning = true
          setShowHint(false)
        }
        return
      }

      const key = e.key.toLowerCase()
      if (key === "arrowup" || key === "w") {
        e.preventDefault()
        if (direction.y === 0) nextDirection = { x: 0, y: -1 }
      }
      if (key === "arrowdown" || key === "s") {
        e.preventDefault()
        if (direction.y === 0) nextDirection = { x: 0, y: 1 }
      }
      if (key === "arrowleft" || key === "a") {
        e.preventDefault()
        if (direction.x === 0) nextDirection = { x: -1, y: 0 }
      }
      if (key === "arrowright" || key === "d") {
        e.preventDefault()
        if (direction.x === 0) nextDirection = { x: 1, y: 0 }
      }
    }

    const onClick = () => {
      if (!gameRunning) {
        gameRunning = true
        setShowHint(false)
      } else {
        gameRunning = false
      }
    }

    document.addEventListener("keydown", onKey)
    cvs.addEventListener("click", onClick)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener("keydown", onKey)
      cvs.removeEventListener("click", onClick)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block touch-none cursor-pointer rounded-xl shadow-2xl"
          style={{ imageRendering: "pixelated" }}
          aria-label="Snake game canvas"
        />
      </div>
      <p className="mt-4 text-center leading-relaxed text-muted-foreground">
        {showHint ? "Leertaste zum Starten, Pfeiltasten oder WASD zum Steuern" : "Pfeiltasten oder WASD — Snake steuern!"}
      </p>
    </div>
  )
}
