<script setup>
/**
 * WelcomeView.vue — 登录成功后的欢迎页
 * 路由 /welcome?nickname=xxx
 */
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const nickname = route.query.nickname || '大侠'
</script>

<template>
  <div class="welcome-page">
    <h1>👑 欢迎{{ nickname }}大王归位</h1>
    <p class="sub">登录成功，尽情探索吧。</p>
    <button class="btn" @click="router.push('/')">返回首页</button>
  </div>
</template>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
.welcome-page {
  width: 100vw; height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1025 50%, #0f0a1a 100%);
  font-family: 'Segoe UI', system-ui, sans-serif; color: #fff;
}
h1 { font-size: 2.8rem; font-weight: 300; margin-bottom: 16px; text-align: center; }
.sub { font-size: 1.1rem; color: rgba(255,255,255,0.4); margin-bottom: 40px; }
.btn {
  padding: 12px 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6);
  font-size: 1rem; font-family: inherit; cursor: pointer; transition: all 0.2s;
}
.btn:hover { color: #fff; border-color: rgba(255,255,255,0.3); }
</style>
