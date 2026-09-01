<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
    <!-- HEADER HERO BANNER -->
    <div class="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center space-y-4">
      <div class="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-2xl shadow-cyan-500/30 ring-2 ring-white/20">
        <Smartphone class="w-8 h-8 sm:w-10 sm:h-10" />
      </div>

      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
          <span>⚡ Ứng Dụng Android Chính Thức</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Tải App Quản Lý Kho Heo (Android APK)
        </h1>
        <p class="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1.5">
          Sử dụng độc lập trên điện thoại Android, đồng bộ dữ liệu thời gian thực 24/7 với hệ thống máy chủ Cloud VPS.
        </p>
      </div>

      <!-- MAIN DOWNLOAD CTA BUTTON -->
      <div class="pt-2 max-w-md mx-auto space-y-3">
        <a
          href="/KhoHeoPro.apk"
          download="KhoHeoPro.apk"
          class="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-cyan-600/30 transition-all transform active:scale-95 cursor-pointer border border-white/20"
        >
          <Download class="w-5 h-5 animate-bounce" />
          <span>TẢI FILE CÀI ĐẶT .APK (4.2 MB)</span>
        </a>
        <div class="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
          <span>Phiên bản: <b>v1.0.0 Pro</b></span>
          <span>•</span>
          <span>Dung lượng: <b>4.2 MB</b></span>
          <span>•</span>
          <span>Hỗ trợ: <b>Android 8.0+</b></span>
        </div>
      </div>
    </div>

    <!-- QR CODE SCAN SECTION & STEP BY STEP GUIDE -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Cột 1: Quét mã QR bằng camera điện thoại -->
      <div class="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col items-center text-center justify-between space-y-4">
        <div>
          <div class="inline-flex items-center gap-1 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <QrCode class="w-4 h-4" />
            <span>Quét Mã Tải Bằng Điện Thoại</span>
          </div>
          <h3 class="text-base font-bold text-white">Quét QR Để Tải Trực Tiếp</h3>
          <p class="text-xs text-slate-400 mt-1">Dùng Camera hoặc Zalo quét mã bên dưới để tải file APK về máy</p>
        </div>

        <div class="p-3 bg-white rounded-2xl shadow-xl shadow-black/40 ring-4 ring-slate-800">
          <canvas ref="qrCanvas" class="w-44 h-44"></canvas>
        </div>

        <p class="text-[11px] text-slate-400 break-all font-mono bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          {{ downloadUrl }}
        </p>
      </div>

      <!-- Cột 2: Hướng dẫn cài đặt 3 bước -->
      <div class="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
        <div>
          <div class="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <ShieldCheck class="w-4 h-4" />
            <span>Hướng Dẫn Cài Đặt Chi Tiết</span>
          </div>
          <h3 class="text-base font-bold text-white">3 Bước Cài Đặt Dễ Dàng</h3>
        </div>

        <div class="space-y-3.5 text-xs text-slate-300">
          <div class="flex items-start gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80">
            <div class="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-cyan-500/30">
              1
            </div>
            <div>
              <p class="font-bold text-white">Bấm nút "Tải File Cài Đặt .APK"</p>
              <p class="text-slate-400 text-[11px] mt-0.5">Trình duyệt điện thoại sẽ tải file <code>KhoHeoPro.apk</code> về máy.</p>
            </div>
          </div>

          <div class="flex items-start gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80">
            <div class="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-cyan-500/30">
              2
            </div>
            <div>
              <p class="font-bold text-white">Mở file và chọn "Cài Đặt"</p>
              <p class="text-slate-400 text-[11px] mt-0.5">Nếu điện thoại hỏi <i>"Cho phép cài đặt nguồn không xác định?"</i> ➜ Chọn <b>Cho phép</b>.</p>
            </div>
          </div>

          <div class="flex items-start gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80">
            <div class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px] border border-emerald-500/30">
              3
            </div>
            <div>
              <p class="font-bold text-white">Mở App & Sử Dụng 24/7</p>
              <p class="text-slate-400 text-[11px] mt-0.5">App tự động kết nối với máy chủ Cloud VPS, đồng bộ dữ liệu song song với Laptop.</p>
            </div>
          </div>
        </div>

        <div class="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400">
          <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Hệ thống hỗ trợ cả <b>Web</b> và <b>App APK</b> cùng lúc không giới hạn.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Smartphone, Download, QrCode, ShieldCheck, CheckCircle2 } from 'lucide-vue-next';
import QRCode from 'qrcode';

const qrCanvas = ref(null);

const downloadUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/KhoHeoPro.apk`;
  }
  return 'http://157.66.219.32/KhoHeoPro.apk';
});

onMounted(async () => {
  if (qrCanvas.value) {
    try {
      await QRCode.toCanvas(qrCanvas.value, downloadUrl.value, {
        width: 176,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    } catch (e) {
      console.error("Lỗi tạo QR code APK:", e);
    }
  }
});
</script>
