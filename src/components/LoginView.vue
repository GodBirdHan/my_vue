<script setup>
/**
 * LoginView.vue — 登录弹窗组件
 *
 * 职责：
 *   1. 展示登录表单（用户名 + 密码）
 *   2. 点击登录 → 调后端 /api/auth/login 接口
 *   3. 成功 → 向父组件 emit('login-success', data)
 *   4. 失败 → 显示错误信息
 */
import { ref } from 'vue'

// ---- 表单数据 ----
const username = ref('')
const password = ref('')

// ---- 状态 ----
const error = ref('')       // 错误提示文案
const loading = ref(false)  // 是否正在请求中（防重复提交 + 按钮显示"登录中..."）

// ---- 向父组件（App.vue）暴露的事件 ----
const emit = defineEmits(['login-success'])

/**
 * 点击登录按钮。
 * ① 校验非空 → ② fetch 调后端 → ③ 根据结果更新状态
 */
async function handleLogin() {
  error.value = ''

  // 前端非空校验（后端也有 @NotBlank，但前端先拦一道，体验更好）
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  try {
    // 调后端登录接口
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })

    const data = await res.json()

    if (data.success) {
      emit('login-success', data)     // 告诉父组件"登录成功"，把用户信息传过去
    } else {
      error.value = data.message || '登录失败'
    }
  } catch (e) {
    // 网络错误或后端没启动
    error.value = '无法连接服务器，请确认后端已启动'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 毛玻璃遮罩层，点击空白处可以关掉（由父组件控制 v-if） -->
  <div class="login-overlay">
    <div class="login-card">
      <h2>登录</h2>
      <p class="hint">测试账号：admin / 123456</p>

      <!-- 用户名输入框，回车触发表单提交 -->
      <div class="field">
        <input
          v-model="username"
          type="text"
          placeholder="用户名"
          @keyup.enter="handleLogin"
        />
      </div>

      <!-- 密码输入框，回车触发表单提交 -->
      <div class="field">
        <input
          v-model="password"
          type="password"
          placeholder="密码"
          @keyup.enter="handleLogin"
        />
      </div>

      <!-- 错误提示（仅在有错误时显示） -->
      <p v-if="error" class="error">{{ error }}</p>

      <!-- 登录按钮（请求中禁用，防止重复提交） -->
      <button class="btn-login" :disabled="loading" @click="handleLogin">
        {{ loading ? '登录中...' : '登 录' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ---- 遮罩层：覆盖整个页面，毛玻璃效果 ---- */
.login-overlay {
  position: fixed;
  inset: 0;                      /* = top:0; right:0; bottom:0; left:0 */
  z-index: 10;                   /* 盖在所有内容上面 */
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);    /* 毛玻璃模糊效果 */
}

/* ---- 登录卡片 ---- */
.login-card {
  background: rgba(20, 20, 35, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px 36px;
  width: 360px;
  color: #fff;
  text-align: center;
}

.login-card h2 {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 6px;
}

.hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 28px;
}

/* ---- 输入框 ---- */
.field {
  margin-bottom: 16px;
}

.field input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border 0.2s;
}

.field input:focus {
  border-color: rgba(99, 102, 241, 0.6);   /* 聚焦时亮紫色边框 */
}

.field input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

/* ---- 错误提示 ---- */
.error {
  color: #f87171;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

/* ---- 登录按钮 ---- */
.btn-login {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);  /* 紫到蓝紫渐变 */
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login:hover:not(:disabled) {
  transform: scale(1.03);
  box-shadow: 0 0 24px rgba(99, 102, 241, 0.35);
}

.btn-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
