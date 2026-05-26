"use client"

import { useEffect, useRef, useState } from "react"

const CANVAS_W = 300
const CANVAS_H = 500

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext("2d")
    if (!ctx) return

    ctx.imageSmoothingEnabled = false

    // ---- Assets ----
    const theme1 = new Image()
    theme1.src = "/img/og-theme.png"
    const theme2 = new Image()
    theme2.src = "/img/og-theme-2.png"

    const SFX_SCORE = new Audio("/audio/sfx_point.wav")
    const SFX_FLAP = new Audio("/audio/sfx_wing.wav")
    const SFX_COLLISION = new Audio("/audio/sfx_hit.wav")
    const SFX_FALL = new Audio("/audio/sfx_die.wav")
    const SFX_SWOOSH = new Audio("/audio/sfx_swooshing.wav")

    let frame = 0
    const degree = Math.PI / 180

    const gameState = { current: 0, getReady: 0, play: 1, gameOver: 2 }

    let best = 0
    try {
      const stored = localStorage.getItem("flappy-best")
      if (stored) best = parseInt(stored, 10) || 0
    } catch {}

    const bg = {
      imgX: 0,
      imgY: 0,
      width: 276,
      height: 228,
      x: 0,
      y: cvs.height - 228,
      w: 276,
      h: 228,
      dx: 0.2,
      render() {
        ctx.drawImage(theme1, this.imgX, this.imgY, this.width, this.height, this.x, this.y, this.w, this.h)
        ctx.drawImage(theme1, this.imgX, this.imgY, this.width, this.height, this.x + this.width, this.y, this.w, this.h)
        ctx.drawImage(theme1, this.imgX, this.imgY, this.width, this.height, this.x + this.width * 2, this.y, this.w, this.h)
      },
      position() {
        if (gameState.current === gameState.getReady) this.x = 0
        if (gameState.current === gameState.play) this.x = (this.x - this.dx) % this.w
      },
    }

    const pipes = {
      top: { imgX: 56, imgY: 323 },
      bot: { imgX: 84, imgY: 323 },
      width: 26,
      height: 160,
      w: 55,
      h: 300,
      gap: 85,
      dx: 2,
      minY: -260,
      maxY: -40,
      pipeGenerator: [] as { x: number; y: number }[],
      reset() {
        this.pipeGenerator = []
      },
      render() {
        for (let i = 0; i < this.pipeGenerator.length; i++) {
          const pipe = this.pipeGenerator[i]
          const topPipe = pipe.y
          const bottomPipe = pipe.y + this.gap + this.h
          ctx.drawImage(theme2, this.top.imgX, this.top.imgY, this.width, this.height, pipe.x, topPipe, this.w, this.h)
          ctx.drawImage(theme2, this.bot.imgX, this.bot.imgY, this.width, this.height, pipe.x, bottomPipe, this.w, this.h)
        }
      },
      position() {
        if (gameState.current !== gameState.play) return
        if (frame % 100 === 0) {
          this.pipeGenerator.push({
            x: cvs.width,
            y: Math.floor(Math.random() * (this.maxY - this.minY + 1)) + this.minY,
          })
        }
        for (let i = 0; i < this.pipeGenerator.length; i++) {
          const pg = this.pipeGenerator[i]
          const b = {
            left: bird.x - bird.r,
            right: bird.x + bird.r,
            top: bird.y - bird.r,
            bottom: bird.y + bird.r,
          }
          const p = {
            top: { top: pg.y, bottom: pg.y + this.h },
            bot: { top: pg.y + this.h + this.gap, bottom: pg.y + this.h * 2 + this.gap },
            left: pg.x,
            right: pg.x + this.w,
          }

          pg.x -= this.dx

          if (pg.x < -this.w) {
            this.pipeGenerator.shift()
            score.current++
            SFX_SCORE.play().catch(() => {})
            if (score.current > best) {
              best = score.current
              try {
                localStorage.setItem("flappy-best", String(best))
              } catch {}
            }
          }

          if (b.left < p.right && b.right > p.left && b.top < p.top.bottom && b.bottom > p.top.top) {
            gameState.current = gameState.gameOver
            SFX_COLLISION.play().catch(() => {})
          }
          if (b.left < p.right && b.right > p.left && b.top < p.bot.bottom && b.bottom > p.bot.top) {
            gameState.current = gameState.gameOver
            SFX_COLLISION.play().catch(() => {})
          }
        }
      },
    }

    const ground = {
      imgX: 276,
      imgY: 0,
      width: 224,
      height: 112,
      x: 0,
      y: cvs.height - 112,
      w: 224,
      h: 112,
      dx: 2,
      render() {
        ctx.drawImage(theme1, this.imgX, this.imgY, this.width, this.height, this.x, this.y, this.w, this.h)
        ctx.drawImage(theme1, this.imgX, this.imgY, this.width, this.height, this.x + this.width, this.y, this.w, this.h)
      },
      position() {
        if (gameState.current === gameState.getReady) this.x = 0
        if (gameState.current === gameState.play) this.x = (this.x - this.dx) % (this.w / 2)
      },
    }

    const map = [
      { imgX: 496, imgY: 60, width: 12, height: 18 },
      { imgX: 135, imgY: 455, width: 10, height: 18 },
      { imgX: 292, imgY: 160, width: 12, height: 18 },
      { imgX: 306, imgY: 160, width: 12, height: 18 },
      { imgX: 320, imgY: 160, width: 12, height: 18 },
      { imgX: 334, imgY: 160, width: 12, height: 18 },
      { imgX: 292, imgY: 184, width: 12, height: 18 },
      { imgX: 306, imgY: 184, width: 12, height: 18 },
      { imgX: 320, imgY: 184, width: 12, height: 18 },
      { imgX: 334, imgY: 184, width: 12, height: 18 },
    ]

    const score = {
      current: 0,
      x: cvs.width / 2,
      y: 40,
      w: 15,
      h: 25,
      reset() {
        this.current = 0
      },
      render() {
        if (gameState.current === gameState.play || gameState.current === gameState.gameOver) {
          const string = this.current.toString()
          const ones = parseInt(string.charAt(string.length - 1) || "0", 10)
          const tens = parseInt(string.charAt(string.length - 2) || "0", 10)
          const hundreds = parseInt(string.charAt(string.length - 3) || "0", 10)

          if (this.current >= 1000) {
            gameState.current = gameState.gameOver
          } else if (this.current >= 100) {
            ctx.drawImage(theme2, map[ones].imgX, map[ones].imgY, map[ones].width, map[ones].height, this.x - this.w / 2 + this.w + 3, this.y, this.w, this.h)
            ctx.drawImage(theme2, map[tens].imgX, map[tens].imgY, map[tens].width, map[tens].height, this.x - this.w / 2, this.y, this.w, this.h)
            ctx.drawImage(theme2, map[hundreds].imgX, map[hundreds].imgY, map[hundreds].width, map[hundreds].height, this.x - this.w / 2 - this.w - 3, this.y, this.w, this.h)
          } else if (this.current >= 10) {
            ctx.drawImage(theme2, map[ones].imgX, map[ones].imgY, map[ones].width, map[ones].height, this.x - this.w / 2 + this.w / 2 + 3, this.y, this.w, this.h)
            ctx.drawImage(theme2, map[tens].imgX, map[tens].imgY, map[tens].width, map[tens].height, this.x - this.w / 2 - this.w / 2 - 3, this.y, this.w, this.h)
          } else {
            ctx.drawImage(theme2, map[ones].imgX, map[ones].imgY, map[ones].width, map[ones].height, this.x - this.w / 2, this.y, this.w, this.h)
          }
        }
      },
    }

    // Original yellow Flappy Bird sprite from theme1
    const bird = {
      animation: [
        { imgX: 276, imgY: 114 },
        { imgX: 276, imgY: 140 },
        { imgX: 276, imgY: 166 },
        { imgX: 276, imgY: 140 },
      ],
      fr: 0,
      width: 34,
      height: 24,
      x: 50,
      y: 160,
      w: 34,
      h: 24,
      r: 12,
      fly: 5.25,
      gravity: 0.32,
      velocity: 0,
      rotation: 0,
      render() {
        const f = this.animation[this.fr]
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.drawImage(theme1, f.imgX, f.imgY, this.width, this.height, -this.w / 2, -this.h / 2, this.w, this.h)
        ctx.restore()
      },
      flap() {
        this.velocity = -this.fly
      },
      reset() {
        this.y = 160
        this.velocity = 0
        this.rotation = 0
      },
      position() {
        if (gameState.current === gameState.getReady) {
          this.y = 160
          this.rotation = 0
          if (frame % 20 === 0) this.fr += 1
          if (this.fr > this.animation.length - 1) this.fr = 0
        } else {
          if (frame % 4 === 0) this.fr += 1
          if (this.fr > this.animation.length - 1) this.fr = 0

          this.velocity += this.gravity
          this.y += this.velocity

          if (this.velocity <= this.fly) {
            this.rotation = -15 * degree
          } else if (this.velocity >= this.fly + 2) {
            this.rotation = 70 * degree
            this.fr = 1
          } else {
            this.rotation = 0
          }

          if (this.y + this.h / 2 >= cvs.height - ground.h) {
            this.y = cvs.height - ground.h - this.h / 2
            this.fr = 1
            this.rotation = 70 * degree
            if (gameState.current === gameState.play) {
              gameState.current = gameState.gameOver
              SFX_FALL.play().catch(() => {})
            }
          }

          if (this.y - this.h / 2 <= 0) {
            this.y = this.r
          }
        }
      },
    }

    const getReady = {
      imgX: 0,
      imgY: 228,
      width: 174,
      height: 160,
      x: cvs.width / 2 - 174 / 2,
      y: cvs.height / 2 - 160,
      w: 174,
      h: 160,
      render() {
        if (gameState.current === gameState.getReady) {
          ctx.drawImage(theme1, this.imgX, this.imgY, this.width, this.height, this.x, this.y, this.w, this.h)
        }
      },
    }

    const gameOver = {
      imgX: 174,
      imgY: 228,
      width: 226,
      height: 158,
      x: cvs.width / 2 - 226 / 2,
      y: cvs.height / 2 - 160,
      w: 226,
      h: 160,
      render() {
        if (gameState.current === gameState.gameOver) {
          ctx.drawImage(theme1, this.imgX, this.imgY, this.width, this.height, this.x, this.y, this.w, this.h)
          const bestStr = best.toString()
          const startX = this.x + this.w - 50
          const yPos = this.y + 85
          const dw = 12
          const dh = 18
          for (let i = 0; i < bestStr.length; i++) {
            const d = parseInt(bestStr.charAt(i), 10)
            ctx.drawImage(theme2, map[d].imgX, map[d].imgY, map[d].width, map[d].height, startX + i * (dw - 2), yPos, dw, dh)
          }
        }
      },
    }

    const draw = () => {
      ctx.fillStyle = "#00bbc4"
      ctx.fillRect(0, 0, cvs.width, cvs.height)
      bg.render()
      pipes.render()
      ground.render()
      score.render()
      bird.render()
      getReady.render()
      gameOver.render()
    }
    const update = () => {
      bird.position()
      bg.position()
      pipes.position()
      ground.position()
    }
    const loop = () => {
      draw()
      update()
      frame++
    }

    const intervalId = window.setInterval(loop, 17)
    loop()

    const onAction = () => {
      if (gameState.current === gameState.getReady) {
        gameState.current = gameState.play
        setShowHint(false)
      }
      if (gameState.current === gameState.play) {
        bird.flap()
        SFX_FLAP.currentTime = 0
        SFX_FLAP.play().catch(() => {})
      }
      if (gameState.current === gameState.gameOver) {
        pipes.reset()
        score.reset()
        bird.reset()
        gameState.current = gameState.getReady
        SFX_SWOOSH.play().catch(() => {})
        setShowHint(true)
      }
    }

    const onClick = () => onAction()
    const onTouch = (e: TouchEvent) => {
      e.preventDefault()
      onAction()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.keyCode === 32) {
        e.preventDefault()
        onAction()
      }
    }

    cvs.addEventListener("click", onClick)
    cvs.addEventListener("touchstart", onTouch)
    document.body.addEventListener("keydown", onKey)

    return () => {
      window.clearInterval(intervalId)
      cvs.removeEventListener("click", onClick)
      cvs.removeEventListener("touchstart", onTouch)
      document.body.removeEventListener("keydown", onKey)
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
          style={{ imageRendering: "pixelated", background: "#00bbc4" }}
          aria-label="Flappy Bird game canvas"
        />
      </div>

      <p className="mt-4 text-center leading-relaxed text-muted-foreground">
        {showHint ? "Klick oder drücke die Leertaste zum Starten" : "Klick / Tap / Leertaste — flatter!"}
      </p>
    </div>
  )
}
