"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const GRID_SIZE = 20
const TILE_SIZE = 20
const CANVAS_W = GRID_SIZE * TILE_SIZE
const CANVAS_H = GRID_SIZE * TILE_SIZE

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover">("ready")
  const [displayScore, setDisplayScore] = useState(0)
  const [displayBest, setDisplayBest] = useState(0)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext("2d")
    if (!ctx) return

    // Game state
    let state: "ready" | "playing" | "gameover" = "ready"
    let score = 0
    let bestScore = 0
    try {
      const stored = localStorage.getItem("snake-best")
      if (stored) bestScore = parseInt(stored, 10) || 0
      setDisplayBest(bestScore)
    } catch {}

    // Particles
    let particles: Particle[] = []

    // Snake array
    let snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ]
    let food = { x: 15, y: 15 }
    let direction = { x: 1, y: 0 }
    let nextDirection = { x: 1, y: 0 }
    let frame = 0
    let foodPulse = 0

    const spawnParticles = (x: number, y: number, color: string, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
        const speed = 2 + Math.random() * 3
        particles.push({
          x: x * TILE_SIZE + TILE_SIZE / 2,
          y: y * TILE_SIZE + TILE_SIZE / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color,
          size: 3 + Math.random() * 3,
        })
      }
    }

    const generateFood = () => {
      let valid = false
      while (!valid) {
        food = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        }
        valid = true
        for (let segment of snake) {
          if (segment.x === food.x && segment.y === food.y) {
            valid = false
            break
          }
        }
      }
    }

    const resetGame = () => {
      snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ]
      direction = { x: 1, y: 0 }
      nextDirection = { x: 1, y: 0 }
      score = 0
      setDisplayScore(0)
      generateFood()
      particles = []
    }

    const update = () => {
      frame++
      foodPulse += 0.15

      // Update particles
      particles = particles.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1 // gravity
        p.life -= 0.03
        return p.life > 0
      })

      if (state !== "playing") return

      if (frame % 8 !== 0) return // Speed control

      direction = nextDirection

      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        state = "gameover"
        setGameState("gameover")
        spawnParticles(snake[0].x, snake[0].y, "#ff6b6b", 20)
        return
      }

      // Self collision
      for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
          state = "gameover"
          setGameState("gameover")
          spawnParticles(head.x, head.y, "#ff6b6b", 20)
          return
        }
      }

      snake.unshift(head)

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        score++
        setDisplayScore(score)
        spawnParticles(food.x, food.y, "#4ecdc4", 12)
        if (score > bestScore) {
          bestScore = score
          setDisplayBest(bestScore)
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
      // Dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
      gradient.addColorStop(0, "#0a0a1a")
      gradient.addColorStop(1, "#151530")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Grid lines (subtle neon)
      ctx.strokeStyle = "rgba(78, 205, 196, 0.08)"
      ctx.lineWidth = 1
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

      // Draw particles
      particles.forEach((p) => {
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // Snake body with gradient
      snake.forEach((segment, index) => {
        const progress = index / snake.length
        const x = segment.x * TILE_SIZE
        const y = segment.y * TILE_SIZE

        // Glow effect
        if (index === 0) {
          ctx.shadowColor = "rgba(255, 193, 7, 0.8)"
          ctx.shadowBlur = 15
        } else {
          ctx.shadowColor = "rgba(255, 180, 0, 0.4)"
          ctx.shadowBlur = 8
        }

        // Gradient from gold to amber
        const hue = 45 - progress * 10
        const lightness = 60 - progress * 15
        ctx.fillStyle = `hsl(${hue}, 90%, ${lightness}%)`

        // Rounded segments
        const padding = 2
        const radius = 4
        const segW = TILE_SIZE - padding * 2
        const segH = TILE_SIZE - padding * 2
        const segX = x + padding
        const segY = y + padding

        ctx.beginPath()
        ctx.roundRect(segX, segY, segW, segH, radius)
        ctx.fill()

        // Eyes on head
        if (index === 0) {
          ctx.shadowBlur = 0
          ctx.fillStyle = "#111"
          const eyeSize = 3
          const eyeOffset = 4
          if (direction.x === 1) {
            ctx.beginPath()
            ctx.arc(x + TILE_SIZE - eyeOffset, y + eyeOffset + 2, eyeSize, 0, Math.PI * 2)
            ctx.arc(x + TILE_SIZE - eyeOffset, y + TILE_SIZE - eyeOffset - 2, eyeSize, 0, Math.PI * 2)
            ctx.fill()
          } else if (direction.x === -1) {
            ctx.beginPath()
            ctx.arc(x + eyeOffset, y + eyeOffset + 2, eyeSize, 0, Math.PI * 2)
            ctx.arc(x + eyeOffset, y + TILE_SIZE - eyeOffset - 2, eyeSize, 0, Math.PI * 2)
            ctx.fill()
          } else if (direction.y === -1) {
            ctx.beginPath()
            ctx.arc(x + eyeOffset + 2, y + eyeOffset, eyeSize, 0, Math.PI * 2)
            ctx.arc(x + TILE_SIZE - eyeOffset - 2, y + eyeOffset, eyeSize, 0, Math.PI * 2)
            ctx.fill()
          } else {
            ctx.beginPath()
            ctx.arc(x + eyeOffset + 2, y + TILE_SIZE - eyeOffset, eyeSize, 0, Math.PI * 2)
            ctx.arc(x + TILE_SIZE - eyeOffset - 2, y + TILE_SIZE - eyeOffset, eyeSize, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.shadowBlur = 0
      })

      // Food (apple with pulse animation)
      const pulseScale = 1 + Math.sin(foodPulse) * 0.15
      const foodX = food.x * TILE_SIZE + TILE_SIZE / 2
      const foodY = food.y * TILE_SIZE + TILE_SIZE / 2
      const foodRadius = (TILE_SIZE / 2 - 3) * pulseScale

      // Glow
      ctx.shadowColor = "rgba(255, 107, 107, 0.9)"
      ctx.shadowBlur = 20

      // Apple body
      ctx.fillStyle = "#ff6b6b"
      ctx.beginPath()
      ctx.arc(foodX, foodY, foodRadius, 0, Math.PI * 2)
      ctx.fill()

      // Apple highlight
      ctx.shadowBlur = 0
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
      ctx.beginPath()
      ctx.arc(foodX - foodRadius * 0.3, foodY - foodRadius * 0.3, foodRadius * 0.3, 0, Math.PI * 2)
      ctx.fill()

      // Apple stem
      ctx.fillStyle = "#5d4037"
      ctx.fillRect(foodX - 1.5, foodY - foodRadius - 4, 3, 5)

      // Leaf
      ctx.fillStyle = "#4caf50"
      ctx.beginPath()
      ctx.ellipse(foodX + 3, foodY - foodRadius - 2, 4, 2, Math.PI / 4, 0, Math.PI * 2)
      ctx.fill()

      // Score UI - glass panel
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.beginPath()
      ctx.roundRect(8, 8, 90, 50, 8)
      ctx.fill()
      ctx.strokeStyle = "rgba(255, 193, 7, 0.3)"
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = "#ffc107"
      ctx.font = "bold 14px 'Segoe UI', Arial"
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${score}`, 16, 28)
      ctx.fillStyle = "#aaa"
      ctx.font = "12px 'Segoe UI', Arial"
      ctx.fillText(`Best: ${bestScore}`, 16, 46)

      // Game over overlay
      if (state === "gameover") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)"
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

        // Game over box
        ctx.fillStyle = "rgba(20, 20, 40, 0.95)"
        ctx.beginPath()
        ctx.roundRect(CANVAS_W / 2 - 100, CANVAS_H / 2 - 70, 200, 140, 16)
        ctx.fill()
        ctx.strokeStyle = "rgba(255, 107, 107, 0.5)"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = "#ff6b6b"
        ctx.font = "bold 24px 'Segoe UI', Arial"
        ctx.textAlign = "center"
        ctx.fillText("Game Over", CANVAS_W / 2, CANVAS_H / 2 - 30)

        ctx.fillStyle = "#ffc107"
        ctx.font = "18px 'Segoe UI', Arial"
        ctx.fillText(`Score: ${score}`, CANVAS_W / 2, CANVAS_H / 2 + 5)

        ctx.fillStyle = "#888"
        ctx.font = "14px 'Segoe UI', Arial"
        ctx.fillText(`Best: ${bestScore}`, CANVAS_W / 2, CANVAS_H / 2 + 28)

        ctx.fillStyle = "#4ecdc4"
        ctx.font = "12px 'Segoe UI', Arial"
        ctx.fillText("Click to restart", CANVAS_W / 2, CANVAS_H / 2 + 55)
      }

      // Ready screen
      if (state === "ready") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

        ctx.fillStyle = "rgba(20, 20, 40, 0.95)"
        ctx.beginPath()
        ctx.roundRect(CANVAS_W / 2 - 110, CANVAS_H / 2 - 60, 220, 120, 16)
        ctx.fill()
        ctx.strokeStyle = "rgba(255, 193, 7, 0.5)"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = "#ffc107"
        ctx.font = "bold 28px 'Segoe UI', Arial"
        ctx.textAlign = "center"
        ctx.fillText("SNAKE", CANVAS_W / 2, CANVAS_H / 2 - 20)

        ctx.fillStyle = "#888"
        ctx.font = "13px 'Segoe UI', Arial"
        ctx.fillText("Pfeiltasten / WASD", CANVAS_W / 2, CANVAS_H / 2 + 10)

        ctx.fillStyle = "#4ecdc4"
        ctx.font = "12px 'Segoe UI', Arial"
        ctx.fillText("Click oder Space zum Starten", CANVAS_W / 2, CANVAS_H / 2 + 40)
      }
    }

    const gameLoop = () => {
      update()
      draw()
    }

    const intervalId = window.setInterval(gameLoop, 1000 / 60)

    const startGame = () => {
      if (state === "ready" || state === "gameover") {
        if (state === "gameover") {
          resetGame()
        }
        state = "playing"
        setGameState("playing")
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.keyCode === 32) {
        e.preventDefault()
        startGame()
        return
      }

      if (state !== "playing") return

      const key = e.key.toLowerCase()
      if ((key === "arrowup" || key === "w") && direction.y === 0) {
        e.preventDefault()
        nextDirection = { x: 0, y: -1 }
      }
      if ((key === "arrowdown" || key === "s") && direction.y === 0) {
        e.preventDefault()
        nextDirection = { x: 0, y: 1 }
      }
      if ((key === "arrowleft" || key === "a") && direction.x === 0) {
        e.preventDefault()
        nextDirection = { x: -1, y: 0 }
      }
      if ((key === "arrowright" || key === "d") && direction.x === 0) {
        e.preventDefault()
        nextDirection = { x: 1, y: 0 }
      }
    }

    const onClick = () => startGame()

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
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="block touch-none cursor-pointer rounded-xl shadow-2xl ring-1 ring-white/10"
        aria-label="Snake game canvas"
      />
      <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
        {gameState === "ready" && "Pfeiltasten oder WASD zum Steuern"}
        {gameState === "playing" && "Friss Aepfel, werde groesser!"}
        {gameState === "gameover" && `Score: ${displayScore} | Best: ${displayBest}`}
      </p>
    </div>
  )
}
