"use client"

import { useEffect, useRef, useState } from "react"

const CANVAS_W = 320
const CANVAS_H = 480

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
  size: number
}

interface Brick {
  x: number
  y: number
  w: number
  h: number
  alive: boolean
  color: string
  hits: number
}

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<"ready" | "playing" | "gameover" | "win">("ready")
  const [displayScore, setDisplayScore] = useState(0)
  const [displayBest, setDisplayBest] = useState(0)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext("2d")
    if (!ctx) return

    let state: "ready" | "playing" | "gameover" | "win" = "ready"
    let score = 0
    let bestScore = 0
    let lives = 3
    let level = 1
    let combo = 0
    let frame = 0

    try {
      const stored = localStorage.getItem("breakout-best")
      if (stored) bestScore = parseInt(stored, 10) || 0
      setDisplayBest(bestScore)
    } catch {}

    let particles: Particle[] = []

    // Paddle
    const paddle = {
      x: CANVAS_W / 2 - 50,
      y: CANVAS_H - 35,
      w: 100,
      h: 14,
      dx: 0,
      speed: 8,
      targetX: CANVAS_W / 2 - 50,
    }

    // Ball
    const ball = {
      x: CANVAS_W / 2,
      y: CANVAS_H - 60,
      r: 8,
      dx: 0,
      dy: 0,
      speed: 5,
      trail: [] as { x: number; y: number }[],
    }

    // Brick colors per row
    const brickColors = [
      { fill: "#ff6b6b", glow: "rgba(255, 107, 107, 0.6)" },
      { fill: "#ffc107", glow: "rgba(255, 193, 7, 0.6)" },
      { fill: "#4ecdc4", glow: "rgba(78, 205, 196, 0.6)" },
      { fill: "#a78bfa", glow: "rgba(167, 139, 250, 0.6)" },
      { fill: "#34d399", glow: "rgba(52, 211, 153, 0.6)" },
    ]

    // Bricks
    let bricks: Brick[] = []

    const createBricks = () => {
      bricks = []
      const brickW = 45
      const brickH = 18
      const padding = 6
      const offsetX = (CANVAS_W - (6 * (brickW + padding) - padding)) / 2
      const offsetY = 60

      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 6; col++) {
          bricks.push({
            x: offsetX + col * (brickW + padding),
            y: offsetY + row * (brickH + padding),
            w: brickW,
            h: brickH,
            alive: true,
            color: brickColors[row].fill,
            hits: row < 2 ? 2 : 1, // Top rows need 2 hits
          })
        }
      }
    }
    createBricks()

    const spawnParticles = (x: number, y: number, color: string, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 2 + Math.random() * 4
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color,
          size: 2 + Math.random() * 4,
        })
      }
    }

    const resetBall = () => {
      ball.x = paddle.x + paddle.w / 2
      ball.y = paddle.y - 20
      ball.dx = 0
      ball.dy = 0
      ball.trail = []
    }

    const resetGame = () => {
      paddle.x = CANVAS_W / 2 - 50
      paddle.targetX = paddle.x
      lives = 3
      score = 0
      level = 1
      combo = 0
      setDisplayScore(0)
      createBricks()
      resetBall()
      particles = []
    }

    const launchBall = () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6
      ball.dx = Math.cos(angle) * ball.speed
      ball.dy = Math.sin(angle) * ball.speed
    }

    const update = () => {
      frame++

      // Update particles
      particles = particles.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.15
        p.life -= 0.025
        return p.life > 0
      })

      if (state !== "playing") return

      // Smooth paddle movement (mouse/touch)
      const smoothing = 0.2
      paddle.x += (paddle.targetX - paddle.x) * smoothing

      // Keyboard paddle movement
      paddle.x += paddle.dx
      if (paddle.x < 0) paddle.x = 0
      if (paddle.x + paddle.w > CANVAS_W) paddle.x = CANVAS_W - paddle.w

      // Ball trail
      ball.trail.push({ x: ball.x, y: ball.y })
      if (ball.trail.length > 8) ball.trail.shift()

      // Ball movement
      ball.x += ball.dx
      ball.y += ball.dy

      // Wall collisions
      if (ball.x - ball.r < 0) {
        ball.dx = Math.abs(ball.dx)
        ball.x = ball.r
        spawnParticles(ball.x, ball.y, "#4ecdc4", 5)
      }
      if (ball.x + ball.r > CANVAS_W) {
        ball.dx = -Math.abs(ball.dx)
        ball.x = CANVAS_W - ball.r
        spawnParticles(ball.x, ball.y, "#4ecdc4", 5)
      }
      if (ball.y - ball.r < 0) {
        ball.dy = Math.abs(ball.dy)
        ball.y = ball.r
        spawnParticles(ball.x, ball.y, "#4ecdc4", 5)
      }

      // Paddle collision
      if (
        ball.dy > 0 &&
        ball.y + ball.r >= paddle.y &&
        ball.y + ball.r <= paddle.y + paddle.h &&
        ball.x >= paddle.x - ball.r &&
        ball.x <= paddle.x + paddle.w + ball.r
      ) {
        const hitPos = (ball.x - paddle.x) / paddle.w
        const angle = -Math.PI / 2 + (hitPos - 0.5) * 1.2
        const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)
        ball.dx = Math.cos(angle) * currentSpeed
        ball.dy = Math.sin(angle) * currentSpeed
        ball.y = paddle.y - ball.r
        combo = 0
        spawnParticles(ball.x, paddle.y, "#ffc107", 8)
      }

      // Brick collisions
      for (let brick of bricks) {
        if (!brick.alive) continue

        if (
          ball.x + ball.r >= brick.x &&
          ball.x - ball.r <= brick.x + brick.w &&
          ball.y + ball.r >= brick.y &&
          ball.y - ball.r <= brick.y + brick.h
        ) {
          brick.hits--
          if (brick.hits <= 0) {
            brick.alive = false
            combo++
            const points = 10 * combo
            score += points
            setDisplayScore(score)
            spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color, 15)
          } else {
            spawnParticles(brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color, 5)
          }

          if (score > bestScore) {
            bestScore = score
            setDisplayBest(bestScore)
            try {
              localStorage.setItem("breakout-best", String(bestScore))
            } catch {}
          }

          // Collision side detection
          const overlapLeft = ball.x + ball.r - brick.x
          const overlapRight = brick.x + brick.w - (ball.x - ball.r)
          const overlapTop = ball.y + ball.r - brick.y
          const overlapBottom = brick.y + brick.h - (ball.y - ball.r)
          const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

          if (minOverlap === overlapTop || minOverlap === overlapBottom) {
            ball.dy = -ball.dy
          } else {
            ball.dx = -ball.dx
          }
          break
        }
      }

      // Check win
      if (bricks.every((b) => !b.alive)) {
        state = "win"
        setGameState("win")
        for (let i = 0; i < 50; i++) {
          spawnParticles(
            Math.random() * CANVAS_W,
            Math.random() * CANVAS_H / 2,
            brickColors[Math.floor(Math.random() * brickColors.length)].fill,
            3
          )
        }
      }

      // Ball falls
      if (ball.y - ball.r > CANVAS_H) {
        lives--
        combo = 0
        if (lives <= 0) {
          state = "gameover"
          setGameState("gameover")
          spawnParticles(CANVAS_W / 2, CANVAS_H / 2, "#ff6b6b", 30)
        } else {
          resetBall()
        }
      }
    }

    const draw = () => {
      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
      bgGradient.addColorStop(0, "#0a0a1a")
      bgGradient.addColorStop(0.5, "#0d1525")
      bgGradient.addColorStop(1, "#151530")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Subtle grid
      ctx.strokeStyle = "rgba(78, 205, 196, 0.03)"
      ctx.lineWidth = 1
      for (let i = 0; i < CANVAS_W; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, CANVAS_H)
        ctx.stroke()
      }
      for (let i = 0; i < CANVAS_H; i += 40) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(CANVAS_W, i)
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

      // Bricks
      bricks.forEach((brick) => {
        if (!brick.alive) return

        const colorIndex = brickColors.findIndex((c) => c.fill === brick.color)
        const glow = brickColors[colorIndex]?.glow || brick.color

        // Glow
        ctx.shadowColor = glow
        ctx.shadowBlur = brick.hits > 1 ? 15 : 8

        // Brick gradient
        const brickGradient = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.h)
        brickGradient.addColorStop(0, brick.color)
        brickGradient.addColorStop(1, adjustColor(brick.color, -30))
        ctx.fillStyle = brickGradient

        ctx.beginPath()
        ctx.roundRect(brick.x, brick.y, brick.w, brick.h, 4)
        ctx.fill()

        // Highlight
        ctx.shadowBlur = 0
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)"
        ctx.beginPath()
        ctx.roundRect(brick.x + 2, brick.y + 2, brick.w - 4, brick.h / 3, 2)
        ctx.fill()

        // Crack effect for damaged bricks
        if (brick.hits === 1 && brickColors.findIndex((c) => c.fill === brick.color) < 2) {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.4)"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(brick.x + brick.w * 0.3, brick.y)
          ctx.lineTo(brick.x + brick.w * 0.5, brick.y + brick.h * 0.5)
          ctx.lineTo(brick.x + brick.w * 0.7, brick.y + brick.h)
          ctx.stroke()
        }
      })

      // Ball trail
      ball.trail.forEach((pos, i) => {
        const alpha = (i / ball.trail.length) * 0.4
        ctx.globalAlpha = alpha
        ctx.fillStyle = "#ff6b6b"
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, ball.r * (i / ball.trail.length), 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // Ball
      ctx.shadowColor = "rgba(255, 107, 107, 0.9)"
      ctx.shadowBlur = 20
      const ballGradient = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 0, ball.x, ball.y, ball.r)
      ballGradient.addColorStop(0, "#ff8a8a")
      ballGradient.addColorStop(1, "#ff6b6b")
      ctx.fillStyle = ballGradient
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Paddle
      ctx.shadowColor = "rgba(255, 193, 7, 0.7)"
      ctx.shadowBlur = 15
      const paddleGradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x, paddle.y + paddle.h)
      paddleGradient.addColorStop(0, "#ffd54f")
      paddleGradient.addColorStop(1, "#ffc107")
      ctx.fillStyle = paddleGradient
      ctx.beginPath()
      ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 7)
      ctx.fill()

      // Paddle highlight
      ctx.shadowBlur = 0
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.beginPath()
      ctx.roundRect(paddle.x + 4, paddle.y + 2, paddle.w - 8, paddle.h / 3, 3)
      ctx.fill()

      // UI Panel
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.beginPath()
      ctx.roundRect(8, 8, 100, 44, 8)
      ctx.fill()
      ctx.strokeStyle = "rgba(255, 193, 7, 0.3)"
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.fillStyle = "#ffc107"
      ctx.font = "bold 13px 'Segoe UI', Arial"
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${score}`, 16, 26)
      ctx.fillStyle = "#888"
      ctx.font = "11px 'Segoe UI', Arial"
      ctx.fillText(`Best: ${bestScore}`, 16, 42)

      // Lives
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.beginPath()
      ctx.roundRect(CANVAS_W - 75, 8, 67, 28, 8)
      ctx.fill()
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < lives ? "#ff6b6b" : "rgba(255, 107, 107, 0.2)"
        ctx.beginPath()
        ctx.arc(CANVAS_W - 60 + i * 20, 22, 7, 0, Math.PI * 2)
        ctx.fill()
      }

      // Combo
      if (combo > 1 && state === "playing") {
        ctx.fillStyle = "#4ecdc4"
        ctx.font = "bold 16px 'Segoe UI', Arial"
        ctx.textAlign = "center"
        ctx.fillText(`${combo}x COMBO!`, CANVAS_W / 2, 30)
      }

      // Overlays
      if (state === "ready") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.65)"
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

        ctx.fillStyle = "rgba(20, 20, 40, 0.95)"
        ctx.beginPath()
        ctx.roundRect(CANVAS_W / 2 - 120, CANVAS_H / 2 - 70, 240, 140, 16)
        ctx.fill()
        ctx.strokeStyle = "rgba(255, 193, 7, 0.5)"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = "#ffc107"
        ctx.font = "bold 28px 'Segoe UI', Arial"
        ctx.textAlign = "center"
        ctx.fillText("BREAKOUT", CANVAS_W / 2, CANVAS_H / 2 - 25)

        ctx.fillStyle = "#888"
        ctx.font = "13px 'Segoe UI', Arial"
        ctx.fillText("Maus oder Pfeiltasten", CANVAS_W / 2, CANVAS_H / 2 + 5)

        ctx.fillStyle = "#4ecdc4"
        ctx.font = "12px 'Segoe UI', Arial"
        ctx.fillText("Click oder Space zum Starten", CANVAS_W / 2, CANVAS_H / 2 + 40)
      }

      if (state === "gameover") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)"
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

        ctx.fillStyle = "rgba(20, 20, 40, 0.95)"
        ctx.beginPath()
        ctx.roundRect(CANVAS_W / 2 - 110, CANVAS_H / 2 - 75, 220, 150, 16)
        ctx.fill()
        ctx.strokeStyle = "rgba(255, 107, 107, 0.5)"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = "#ff6b6b"
        ctx.font = "bold 26px 'Segoe UI', Arial"
        ctx.textAlign = "center"
        ctx.fillText("Game Over", CANVAS_W / 2, CANVAS_H / 2 - 30)

        ctx.fillStyle = "#ffc107"
        ctx.font = "18px 'Segoe UI', Arial"
        ctx.fillText(`Score: ${score}`, CANVAS_W / 2, CANVAS_H / 2 + 5)

        ctx.fillStyle = "#888"
        ctx.font = "14px 'Segoe UI', Arial"
        ctx.fillText(`Best: ${bestScore}`, CANVAS_W / 2, CANVAS_H / 2 + 30)

        ctx.fillStyle = "#4ecdc4"
        ctx.font = "12px 'Segoe UI', Arial"
        ctx.fillText("Click to restart", CANVAS_W / 2, CANVAS_H / 2 + 58)
      }

      if (state === "win") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

        ctx.fillStyle = "rgba(20, 20, 40, 0.95)"
        ctx.beginPath()
        ctx.roundRect(CANVAS_W / 2 - 110, CANVAS_H / 2 - 75, 220, 150, 16)
        ctx.fill()
        ctx.strokeStyle = "rgba(52, 211, 153, 0.6)"
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.fillStyle = "#34d399"
        ctx.font = "bold 26px 'Segoe UI', Arial"
        ctx.textAlign = "center"
        ctx.fillText("You Win!", CANVAS_W / 2, CANVAS_H / 2 - 30)

        ctx.fillStyle = "#ffc107"
        ctx.font = "18px 'Segoe UI', Arial"
        ctx.fillText(`Score: ${score}`, CANVAS_W / 2, CANVAS_H / 2 + 5)

        ctx.fillStyle = "#888"
        ctx.font = "14px 'Segoe UI', Arial"
        ctx.fillText(`Best: ${bestScore}`, CANVAS_W / 2, CANVAS_H / 2 + 30)

        ctx.fillStyle = "#4ecdc4"
        ctx.font = "12px 'Segoe UI', Arial"
        ctx.fillText("Click to play again", CANVAS_W / 2, CANVAS_H / 2 + 58)
      }
    }

    // Helper to darken colors
    function adjustColor(hex: string, amount: number): string {
      const num = parseInt(hex.slice(1), 16)
      const r = Math.max(0, Math.min(255, (num >> 16) + amount))
      const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amount))
      const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amount))
      return `rgb(${r}, ${g}, ${b})`
    }

    const gameLoop = () => {
      update()
      draw()
    }

    const intervalId = window.setInterval(gameLoop, 1000 / 60)

    const startGame = () => {
      if (state === "ready") {
        state = "playing"
        setGameState("playing")
        launchBall()
      } else if (state === "gameover" || state === "win") {
        resetGame()
        state = "playing"
        setGameState("playing")
        launchBall()
      } else if (state === "playing" && ball.dx === 0 && ball.dy === 0) {
        launchBall()
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = cvs.getBoundingClientRect()
      paddle.targetX = e.clientX - rect.left - paddle.w / 2
    }

    const onClick = () => startGame()

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.keyCode === 32) {
        e.preventDefault()
        startGame()
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        paddle.dx = -paddle.speed
      }
      if (e.key === "ArrowRight") {
        e.preventDefault()
        paddle.dx = paddle.speed
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        paddle.dx = 0
      }
    }

    cvs.addEventListener("click", onClick)
    cvs.addEventListener("mousemove", onMouseMove)
    document.addEventListener("keydown", onKey)
    document.addEventListener("keyup", onKeyUp)

    return () => {
      window.clearInterval(intervalId)
      cvs.removeEventListener("click", onClick)
      cvs.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="block touch-none cursor-pointer rounded-xl shadow-2xl ring-1 ring-white/10"
        aria-label="Breakout game canvas"
      />
      <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
        {gameState === "ready" && "Maus oder Pfeiltasten zum Steuern"}
        {gameState === "playing" && "Zerstoere alle Bloecke!"}
        {gameState === "gameover" && `Score: ${displayScore} | Best: ${displayBest}`}
        {gameState === "win" && "Gewonnen! Nochmal spielen?"}
      </p>
    </div>
  )
}
