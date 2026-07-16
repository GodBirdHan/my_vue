<script setup>
/**
 * GuestView.vue — 访客浏览页（独立路由 /guest）
 * 欢迎访客，展示项目简介。登录按钮弹出 LoginModal。
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from '../components/LoginModal.vue'

const router = useRouter()
const showLogin = ref(false)

/** 登录成功 → 跳转欢迎页 */
function onLoginSuccess(data) {
  showLogin.value = false
  router.push({ path: '/welcome', query: { nickname: data.nickname || '大侠' } })
}
</script>

<template>
  <div class="guest-page">
    <div class="card">
      <h1>👋 欢迎来访！</h1>
      <p class="desc">
        这里是 GodBirdHan 的个人站点。<br />
        正在建设中，敬请期待更多内容。
      </p>
      <div class="buttons">
        <button class="btn btn-primary" @click="showLogin = true">去登录</button>
        <button class="btn btn-ghost" @click="router.push('/')">返回首页</button>
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
.guest-page {
  width: 100vw; min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: #0a0a0f;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.card {
  text-align: center; color: #fff; max-width: 500px;
}
.card h1 { font-size: 2.5rem; font-weight: 300; margin-bottom: 24px; }
.desc { font-size: 1.1rem; color: rgba(255, 255, 255, 0.5); line-height: 1.8; margin-bottom: 40px; }
.buttons { display: flex; gap: 16px; justify-content: center; }
.btn { padding: 12px 32px; border-radius: 10px; font-size: 1rem; font-family: inherit; cursor: pointer; transition: all 0.2s; }
.btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; }
.btn-primary:hover { transform: scale(1.05); box-shadow: 0 0 24px rgba(99, 102, 241, 0.3); }
.btn-ghost { background: transparent; color: rgba(255, 255, 255, 0.5); border: 1px solid rgba(255, 255, 255, 0.15); }
.btn-ghost:hover { color: #fff; border-color: rgba(255, 255, 255, 0.3); }
</style>
