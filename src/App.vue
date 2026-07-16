<script setup>
/**
 * App.vue —— 欢迎页面（根组件）
 *
 * 功能：
 *   1. 粒子网络背景（Canvas 动画）
 *   2. 滚动渐显：向下滚动时，文案和按钮逐渐浮现
 *   3. 登录弹窗：点击"登录"弹出 LoginView
 *   4. Toast 提示：登录成功 / 随便看看 后底部弹出欢迎信息
 */
import { ref, onMounted, onUnmounted } from 'vue'
import LoginView from './components/LoginView.vue'

// ---- Canvas 引用 ----
const canvasRef = ref(null)

// ---- 滚动透明度（0 = 完全透明, 1 = 完全不透明）----
const opacity = ref(0)

// ---- UI 状态 ----
const showLogin = ref(false)    // 是否显示登录弹窗
const user = ref(null)           // 登录成功后的用户信息
const guestMode = ref(false)     // 是否处于"随便看看"模式

// ---- 粒子系统数据 ----
let particles = []
let mouse = { x: -999, y: -999 }
let animId = null

// 事件处理器引用，用于 onUnmounted 时移除
let onResize = null
let onMouseMove = null
let onScroll = null

onMounted(() => {
  // ========== 粒子 Canvas 初始化 ==========
  const c = canvasRef.value
  const ctx = c.getContext('2d')
  let w, h

  // 自适应窗口大小
  function resize() {
    w = c.width = window.innerWidth
    h = c.height = window.innerHeight
  }
  resize()
  onResize = resize
  window.addEventListener('resize', onResize)

  // 生成 120 个随机粒子
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * w,                    // 随机 X 坐标
      y: Math.random() * h,                    // 随机 Y 坐标
      vx: (Math.random() - 0.5) * 1.5,        // X 方向速度
      vy: (Math.random() - 0.5) * 1.5,        // Y 方向速度
      r: Math.random() * 2 + 1,               // 半径（1~3px）
    })
  }

  // 跟踪鼠标位置
  onMouseMove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }
  window.addEventListener('mousemove', onMouseMove)

  /**
   * 每帧绘制：
   *   ① 半透明黑覆盖（形成拖尾效果）
   *   ② 移动粒子 + 边界反弹
   *   ③ 粒子之间近距离连线
   *   ④ 鼠标与附近粒子连线
   */
  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.15)'
    ctx.fillRect(0, 0, w, h)

    // 移动粒子 + 边界检测
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0 || p.x > w) p.vx *= -1
      if (p.y < 0 || p.y > h) p.vy *= -1
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(160, 160, 255, 0.8)'
      ctx.fill()
    })

    // 粒子间连线（距离 < 120px 时连线，越近越亮）
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
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    // 鼠标连线（距离 < 180px 时连线到鼠标）
    particles.forEach((p) => {
      const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
      if (d < 180) {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.strokeStyle = `rgba(200, 180, 255, ${1 - d / 180})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
    })

    animId = requestAnimationFrame(draw)   // 循环
  }
  draw()

  // ========== 滚动 → 透明度映射 ==========
  // 滚动 1 个屏幕高度后 opacity 变为 1（完全显示）
  onScroll = () => {
    const scrollY = window.scrollY
    opacity.value = Math.min(scrollY / window.innerHeight, 1)
  }
  window.addEventListener('scroll', onScroll)
})

// ---- 组件卸载时清理 ---- 
onUnmounted(() => {
  cancelAnimationFrame(animId)                        // 停止动画循环
  if (onResize) window.removeEventListener('resize', onResize)
  if (onMouseMove) window.removeEventListener('mousemove', onMouseMove)
  if (onScroll) window.removeEventListener('scroll', onScroll)
})

// ---- 事件处理 ----
function onLoginSuccess(data) {
  user.value = data                      // 保存用户信息
  showLogin.value = false                // 关闭登录弹窗
}

function onGuest() {
  guestMode.value = true                 // 开启"游客"模式
}
</script>

<template>
  <!-- 页面容器：高度设为 200vh，给滚动留出空间 -->
  <div class="welcome">
    <!-- 粒子 Canvas 背景层 -->
    <canvas ref="canvasRef" class="bg-canvas" />

    <!-- ===== 滚动提示箭头（随文案浮现而淡出） ===== -->
    <div class="scroll-hint" :style="{ opacity: 1 - opacity }">
      <div class="arrow">↓</div>
    </div>

    <!-- ===== 主要内容区（固定定位，始终居中） ===== -->
    <div class="content" :style="{ opacity: opacity }">
      <p class="greeting">Hello, I'm</p>
      <h1>GODBIRDHAN</h1>
      <p class="subtitle">Full-Stack Developer · 罗景韩</p>
      <p class="motto">"Stay hungry, stay foolish."</p>

      <!-- 按钮区：比文案晚一点出现（opacity-0.4 的偏移） -->
      <div class="actions" :style="{ opacity: Math.max(0, (opacity - 0.4) * 2.5) }">
        <button class="btn btn-primary" @click="showLogin = true">登 录</button>
        <button class="btn btn-ghost" @click="onGuest">随便看看</button>
      </div>
    </div>

    <!-- ===== 登录弹窗（v-if 控制显隐） ===== -->
    <LoginView
      v-if="showLogin"
      @login-success="onLoginSuccess"
    />

    <!-- ===== 登录成功 Toast ===== -->
    <div v-if="user" class="toast">
      <span>{{ user.nickname }}，欢迎回来 👋</span>
      <button @click="user = null">✕</button>
    </div>

    <!-- ===== 游客 Toast ===== -->
    <div v-if="guestMode" class="toast">
      <span>欢迎来访！随便逛逛吧 👋</span>
      <button @click="guestMode = false">✕</button>
    </div>
  </div>
</template>

<style scoped>
/* ===== 全局重置 ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* ===== 页面容器 ===== */
.welcome {
  width: 100vw;
  height: 200vh;                     /* 双倍高度，确保有滚动空间 */
  background: #0a0a0f;
  font-family: 'Segoe UI', system-ui, sans-serif;
  position: relative;
}

/* ===== Canvas 背景层（固定在背后） ===== */
.bg-canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 0;                        /* 最底层 */
}

/* ===== 滚动提示箭头 ===== */
.scroll-hint {
  position: fixed;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  pointer-events: none;              /* 不挡鼠标事件 */
  transition: opacity 0.6s ease;
}

.arrow {
  font-size: 1.6rem;
  color: rgba(255, 255, 255, 0.3);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(10px); }
}

/* ===== 内容区（固定居中） ===== */
.content {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  z-index: 1;
  pointer-events: none;              /* 不挡粒子交互，但按钮内部 override 了 pointer-events: auto */
  transition: opacity 0.3s ease;
}

.greeting {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
  margin-bottom: 12px;
}

h1 {
  font-size: 4rem;
  font-weight: 300;
  letter-spacing: 0.15em;
  text-shadow: 0 0 40px rgba(120, 120, 255, 0.5);   /* 发光效果 */
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 16px;
  font-weight: 300;
}

.motto {
  margin-top: 40px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.2);
  font-style: italic;
  letter-spacing: 0.05em;
}

/* ===== 按钮区 ===== */
.actions {
  margin-top: 56px;
  display: flex;
  gap: 20px;
  transition: opacity 0.6s ease;
}

.btn {
  padding: 14px 40px;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  pointer-events: auto;              /* 覆盖父级的 pointer-events:none，让按钮可点击 */
  transition: all 0.25s ease;
}

/* 主按钮：紫色渐变 */
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  border: none;
}

.btn-primary:hover {
  transform: scale(1.06);
  box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
}

/* 幽灵按钮：透明底+边框 */
.btn-ghost {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-ghost:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.04);
}

/* ===== 底部 Toast 提示 ===== */
.toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;                                  /* 盖在所有内容上面 */
  background: rgba(20, 20, 35, 0.9);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 12px;
  padding: 14px 28px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 1rem;
  animation: slideUp 0.4s ease;                 /* 从底部滑入 */
}

.toast button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  font-size: 1.1rem;
}

.toast button:hover {
  color: #fff;
}

@keyframes slideUp {
  from { transform: translateX(-50%) translateY(20px); opacity: 0; }
  to { transform: translateX(-50%) translateY(0); opacity: 1; }
}
</style>
