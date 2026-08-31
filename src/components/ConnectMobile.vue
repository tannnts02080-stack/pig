<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
    <div class="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center space-y-4">
      <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-cyan-600/30">
        <Smartphone class="w-8 h-8" />
      </div>

      <div>
        <h1 class="text-2xl font-black text-white">Kết Nối Ứng Dụng Điện Thoại Android (APK)</h1>
        <p class="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Hệ thống được thiết kế theo chuẩn Responsive Mobile-First & REST API sẵn sàng đóng gói APK cho điện thoại
        </p>
      </div>

      <div class="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 max-w-md mx-auto text-left space-y-3 text-xs">
        <div class="flex items-center gap-2 text-cyan-400 font-bold">
          <CheckCircle2 class="w-4 h-4" />
          <span>Kiến Trúc Backend & Mobile Đã Sẵn Sàng</span>
        </div>
        <p class="text-slate-300">
          • Backend Spring Boot đã bật sẵn CORS cho phép truy cập từ thiết bị di động / mạng LAN hoặc Cloud VPS.<br>
          • Giao diện được xây dựng bằng Vue 3 + Tailwind CSS chuẩn hóa 100% cho màn hình cảm ứng điện thoại.<br>
          • Khi bạn muốn build file cài đặt `.apk`, chỉ cần dùng công cụ Capacitor/Cordova đóng gói thư mục `dist`.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Smartphone, CheckCircle2 } from 'lucide-vue-next';
</script>
