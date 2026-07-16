<script setup>
/**
 * LoginModal.vue — 登录弹窗组件
 * 遮罩层毛玻璃虚化背景，居中卡片表单，登录成功 emit 事件给父组件。
 */
import { ref } from 'vue'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const emit = defineEmits(['close', 'login-success'])

async function handleLogin() {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }
  loading.value = true
  try {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    const data = await res.json()
    if (data.success) {
      emit('login-success', data)
    } else {
      error.value = data.message || '登录失败'
    }
  } catch (e) {
    error.value = '无法连接服务器，请确认后端已启动'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 遮罩层：覆盖整个页面，毛玻璃虚化背景 -->
  <div class="overlay" @click.self="emit('close')">
    <div class="modal">
      <h2>登录</h2>
      <p class="hint">测试账号：admin / 123456</p>

      <div class="field">
        <input v-model="username" type="text" placeholder="用户名" @keyup.enter="handleLogin" />
      </div>
      <div class="field">
        <input v-model="password" type="password" placeholder="密码" @keyup.enter="handleLogin" />
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <button class="btn-login" :disabled="loading" @click="handleLogin">
        {{ loading ? '登录中...' : '登 录' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 遮罩层：全屏覆盖 + 毛玻璃虚化 */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);          /* ← 背景虚化 */
  -webkit-backdrop-filter: blur(8px);  /* Safari 兼容 */
}

/* 登录卡片 */
.modal {
  background: rgba(20, 20, 35, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 48px 40px;
  width: 380px;
  color: #fff;
  text-align: center;
}

.modal h2 { font-size: 1.6rem; font-weight: 400; margin-bottom: 8px; }
.hint { font-size: 0.8rem; color: rgba(255, 255, 255, 0.3); margin-bottom: 32px; }

.field { margin-bottom: 16px; }
.field input {
  width: 100%; padding: 12px 16px; border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #fff; font-size: 0.95rem; font-family: inherit;
  outline: none; transition: border 0.2s;
  box-sizing: border-box;
}
.field input:focus { border-color: rgba(99, 102, 241, 0.6); }
.field input::placeholder { color: rgba(255, 255, 255, 0.3); }

.error { color: #f87171; font-size: 0.85rem; margin-bottom: 12px; }

.btn-login {
  width: 100%; padding: 12px; border-radius: 10px; border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff; font-size: 1rem; font-family: inherit; cursor: pointer;
  transition: all 0.2s;
  box-sizing: border-box;
}
.btn-login:hover:not(:disabled) { transform: scale(1.03); box-shadow: 0 0 24px rgba(99, 102, 241, 0.35); }
.btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
