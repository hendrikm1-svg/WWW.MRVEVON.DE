"use client"

import { useEffect, useRef, useState } from "react"

const CANVAS_W = 300
const CANVAS_H = 400

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext("2d")
    if (!ctx) return

    let gameRunning = false
    let score = 0
    let bestScore = 0
    try {
      const stored = localStorage.getItem("breakout-best")
      if (stored) bestScore = parseInt(stored, 10) || 0
    } catch {}

    // Paddle
    const paddle = {
      x: CANVAS_W / 2 - 40,
      y: CANVAS_H - 20,
      w: 80,
      h: 10,
      dx: 0,
      speed: 6,
    }

    // Ball
    const ball = {
      x: CANVAS_W / 2,
      y: CANVAS_H - 40,
      r: 5,
      dx: 0,
      dy: 0,
      speed: 3,
    }

    // Bricks
    const bricks: { x: number; y: number; w: number; h: number; alive: boolean }[] = []
    const createBricks = () => {
      bricks.length = 0
      const brickW = 40
      const brickH = 12
      const padding = 5
      const offsetX = 10
      const offsetY = 30

      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 7; col++) {
          bricks.push({
            x: offsetX + col * (brickW + padding),
            y: offsetY + row * (brickH + padding),
            w: brickW,
            h: brickH,
            alive: true,
          })
        }
      }
    }
    createBricks()

    const resetBall = () => {
      ball.x = paddle.x + paddle.w / 2
      ball.y = paddle.y - 15
      ball.dx = 0
      ball.dy = 0
    }
    resetBall()

    const update = () => {
      if (!gameRunning) return

      // Paddle movement
      paddle.x += paddle.dx
      if (paddle.x < 0) paddle.x = 0
      if (paddle.x + paddle.w > CANVAS_W) paddle.x = CANVAS_W - paddle.w

      // Ball movement
      ball.x += ball.dx
      ball.y += ball.dy

      // Wall collisions
      if (ball.x - ball.r < 0 || ball.x + ball.r > CANVAS_W) {
        ball.dx = -ball.dx
        ball.x = ball.x - ball.r < 0 ? ball.r : CANVAS_W - ball.r
      }
      if (ball.y - ball.r < 0) {
        ball.dy = -ball.dy
        ball.y = ball.r
      }

      // Paddle collision
      if (
        ball.y + ball.r >= paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.w
      ) {
        ball.dy = -ball.speed
        ball.y = paddle.y - ball.r
        // Angle based on hit position
        const hitPos = (ball.x - paddle.x) / paddle.w
        ball.dx = (hitPos - 0.5) * 6
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
          brick.alive = false
          score++
          if (score > bestScore) {
            bestScore = score
            try {
              localStorage.setItem("breakout-best", String(bestScore))
            } catch {}
          }

          // Determine collision side
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

      // Game over
      if (ball.y > CANVAS_H) {
        gameRunning = false
        resetBall()
        paddle.dx = 0
      }
    }

    const draw = () => {
      // Background
      ctx.fillStyle = "#0d1b2a"
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Paddle
      ctx.fillStyle = "#ffc107"
      ctx.shadowColor = "rgba(255, 193, 7, 0.6)"
      ctx.shadowBlur = 10
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h)
      ctx.shadowBlur = 0

      // Ball
      ctx.fillStyle = "#ff6b6b"
      ctx.shadowColor = "rgba(255, 107, 107, 0.8)"
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Bricks
      bricks.forEach((brick) => {
        if (!brick.alive) return
        ctx.fillStyle = "#4ecdc4"
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
        ctx.lineWidth = 0.5
        ctx.strokeRect(brick.x, brick.y, brick.w, brick.h)
      })

      // Score
      ctx.fillStyle = "#ffc107"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${score}`, 8, 20)
      ctx.fillText(`Best: ${bestScore}`, 8, 38)
    }

    const gameLoop = () => {
      update()
      draw()
    }

    const intervalId = window.setInterval(gameLoop, 1000 / 60)

    const onMouseMove = (e: MouseEvent) => {
      const rect = cvs.getBoundingClientRect()
      const x = e.clientX - rect.left
      paddle.x = x - paddle.w / 2
      if (paddle.x < 0) paddle.x = 0
      if (paddle.x + paddle.w > CANVAS_W) paddle.x = CANVAS_W - paddle.w
    }

    const onClick = () => {
      if (!gameRunning) {
        gameRunning = true
        ball.dx = 3
        ball.dy = -ball.speed
        setShowHint(false)
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.keyCode === 32) {
        e.preventDefault()
        if (!gameRunning) {
          gameRunning = true
          ball.dx = 3
          ball.dy = -ball.speed
          setShowHint(false)
        }
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
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block touch-none cursor-pointer rounded-xl shadow-2xl"
          style={{ imageRendering: "pixelated" }}
          aria-label="Breakout game canvas"
        />
      </div>
      <p className="mt-4 text-center leading-relaxed text-muted-foreground">
        {showHint ? "Klick oder Leertaste zum Starten, Maus/Pfeile zum Steuern" : "Maus oder Pfeiltasten — Schläger bewegen!"}
      </p>
    </div>
  )
}
