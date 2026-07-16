<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from '../components/LoginModal.vue'

const router = useRouter()
const canvasRef = ref(null)
const opacity = ref(0)
const showLogin = ref(false)        // 控制弹窗显隐
let particles = []
let mouse = { x: -999, y: -999 }
let animId = null
let onResize = null, onMouseMove = null, onScroll = null

onMounted(() => {
  const c = canvasRef.value
  const ctx = c.getContext('2d')
  let w, h

  onResize = () => {
    w = c.width = window.innerWidth
    h = c.height = window.innerHeight
  }
  onResize()
  window.addEventListener('resize', onResize)

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
      r: Math.random() * 2 + 1,
    })
  }

  onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
  window.addEventListener('mousemove', onMouseMove)

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.15)'
    ctx.fillRect(0, 0, w, h)
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0 || p.x > w) p.vx *= -1
      if (p.y < 0 || p.y > h) p.vy *= -1
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(160, 160, 255, 0.8)'
      ctx.fill()
    })
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(120, 120, 255, ${1 - dist / 120})`
          ctx.lineWidth = 0.5; ctx.stroke()
        }
      }
    }
    particles.forEach((p) => {
      const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
      if (d < 180) {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.strokeStyle = `rgba(200, 180, 255, ${1 - d / 180})`
        ctx.lineWidth = 0.6; ctx.stroke()
      }
    })
    animId = requestAnimationFrame(draw)
  }
  draw()

  onScroll = () => { opacity.value = Math.min(window.scrollY / window.innerHeight, 1) }
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  if (onResize) window.removeEventListener('resize', onResize)
  if (onMouseMove) window.removeEventListener('mousemove', onMouseMove)
  if (onScroll) window.removeEventListener('scroll', onScroll)
})

/** 登录成功 → 跳转欢迎页 */
function onLoginSuccess(data) {
  showLogin.value = false
  router.push({ path: '/welcome', query: { nickname: data.nickname || '大侠' } })
}
</script>

<template>
  <div class="welcome">
    <canvas ref="canvasRef" class="bg-canvas" />

    <div class="scroll-hint" :style="{ opacity: 1 - opacity }">
      <div class="arrow">↓</div>
    </div>

    <div class="content" :style="{ opacity: opacity }">
      <p class="greeting">Hello, I'm</p>
      <h1>GODBIRDHAN</h1>
      <p class="subtitle">Full-Stack Developer · 罗景韩</p>
      <p class="motto">"Stay hungry, stay foolish."</p>

      <div class="actions" :style="{ opacity: Math.max(0, (opacity - 0.4) * 2.5) }">
        <button class="btn btn-primary" @click="showLogin = true">登 录</button>
        <button class="btn btn-ghost" @click="router.push('/guest')">随便看看</button>
      </div>
    </div>

    <!-- 登录弹窗 -->
    <LoginModal
      v-if="showLogin"
      @close="showLogin = false"
      @login-success="onLoginSuccess"
    />
  </div>
</template>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
.welcome { width: 100vw; height: 200vh; background: #0a0a0f; font-family: 'Segoe UI', system-ui, sans-serif; position: relative; }
.bg-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
.scroll-hint { position: fixed; bottom: 48px; left: 50%; transform: translateX(-50%); z-index: 2; pointer-events: none; transition: opacity 0.6s ease; }
.arrow { font-size: 1.6rem; color: rgba(255, 255, 255, 0.3); animation: bounce 2s ease-in-out infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
.content { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; z-index: 1; pointer-events: none; transition: opacity 0.3s ease; }
.greeting { font-size: 1.4rem; color: rgba(255, 255, 255, 0.5); font-weight: 300; margin-bottom: 12px; }
h1 { font-size: 4rem; font-weight: 300; letter-spacing: 0.15em; text-shadow: 0 0 40px rgba(120, 120, 255, 0.5); }
.subtitle { font-size: 1.1rem; color: rgba(255, 255, 255, 0.45); margin-top: 16px; font-weight: 300; }
.motto { margin-top: 40px; font-size: 0.95rem; color: rgba(255, 255, 255, 0.2); font-style: italic; letter-spacing: 0.05em; }
.actions { margin-top: 56px; display: flex; gap: 20px; transition: opacity 0.6s ease; }
.btn { padding: 14px 40px; border-radius: 12px; font-size: 1rem; font-family: inherit; cursor: pointer; pointer-events: auto; transition: all 0.25s ease; }
.btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; }
.btn-primary:hover { transform: scale(1.06); box-shadow: 0 0 30px rgba(99, 102, 241, 0.4); }
.btn-ghost { background: transparent; color: rgba(255, 255, 255, 0.6); border: 1px solid rgba(255, 255, 255, 0.15); }
.btn-ghost:hover { color: #fff; border-color: rgba(255, 255, 255, 0.35); background: rgba(255, 255, 255, 0.04); }
</style>
