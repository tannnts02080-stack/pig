<template>
  <div class="fixed inset-0 z-[9999] bg-[#060913] flex items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-950 font-sans">
    <!-- Background glowing ambient lights -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-10 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Login Modal Card -->
    <div class="relative w-full max-w-md bg-slate-900/90 border border-slate-800 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl shadow-black/80 space-y-6">
      <!-- App Branding -->
      <div class="text-center space-y-2">
        <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-600 to-amber-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-rose-600/30 ring-1 ring-white/20">
          <ShieldCheck class="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-1">
            <span>🔒 KHU VỰC BẢO MẬT GIA ĐÌNH</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
            KHO HEO SỮA PRO
          </h1>
          <p class="text-xs text-slate-400 mt-1">
            Vui lòng đăng nhập tài khoản quản trị để truy cập dữ liệu hệ thống
          </p>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center gap-2.5 text-rose-300 text-xs animate-shake">
          <AlertCircle class="w-4 h-4 shrink-0 text-rose-400" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Username Input -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-300 ml-1">Tài Khoản</label>
          <div class="relative">
            <User class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              v-model="username"
              placeholder="Nhập tên tài khoản quản trị..."
              autocomplete="username"
              class="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              required
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-300 ml-1">Mật Khẩu Bảo Mật</label>
          <div class="relative">
            <Lock class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Nhập mật khẩu bảo mật..."
              autocomplete="current-password"
              class="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
            >
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-600/30 transition transform active:scale-95 cursor-pointer border border-white/20 flex items-center justify-center gap-2 mt-2"
        >
          <LogIn class="w-4 h-4" />
          <span>{{ loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP HỆ THỐNG' }}</span>
        </button>
      </form>

      <!-- Footer Info -->
      <div class="pt-2 text-center border-t border-slate-800/80">
        <p class="text-[11px] text-slate-400">
          Đồng bộ thời gian thực giữa <b>Laptop</b>, <b>Mobile Web</b> và <b>App Android APK</b>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ShieldCheck, Lock, User, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-vue-next';

const emit = defineEmits(['authenticated']);

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const loading = ref(false);

const handleLogin = () => {
  errorMessage.value = '';
  loading.value = true;

  setTimeout(() => {
    const cleanUser = (username.value || '').trim();
    const cleanPass = (password.value || '').trim();

    if (cleanUser === 'admin' && cleanPass === 'giadinh@') {
      localStorage.setItem('kho_heo_authenticated', 'true');
      emit('authenticated');
    } else {
      errorMessage.value = 'Tài khoản hoặc mật khẩu không chính xác! Vui lòng thử lại.';
    }
    loading.value = false;
  }, 200);
};
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.animate-shake {
  animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
</style>
