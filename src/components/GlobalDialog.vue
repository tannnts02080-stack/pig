<template>
  <div>
    <!-- POPUP CONFIRM / ALERT MODAL -->
    <div
      v-if="dialogState.isOpen"
      class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      @click.self="dialogState.cancelText ? handleConfirmDialog(false) : handleConfirmDialog(true)"
    >
      <div
        class="bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl shadow-black p-6 space-y-4 max-w-md w-full ring-1 ring-white/10 animate-in zoom-in-95 duration-200"
        @click.stop
      >
        <!-- Icon & Title -->
        <div class="flex items-start gap-4">
          <div
            :class="[
              'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg',
              dialogState.type === 'danger'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : dialogState.type === 'warning'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            ]"
          >
            <AlertTriangle v-if="dialogState.type === 'danger' || dialogState.type === 'warning'" class="w-6 h-6" />
            <Info v-else class="w-6 h-6" />
          </div>

          <div class="space-y-1 flex-1">
            <h3 class="text-base font-black text-white tracking-tight">
              {{ dialogState.title }}
            </h3>
            <p class="text-xs text-slate-300 leading-relaxed break-words whitespace-pre-line">
              {{ dialogState.message }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800/80">
          <button
            v-if="dialogState.cancelText"
            type="button"
            @click="handleConfirmDialog(false)"
            class="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 transition active:scale-95 cursor-pointer"
          >
            {{ dialogState.cancelText }}
          </button>

          <button
            type="button"
            @click="handleConfirmDialog(true)"
            :class="[
              'px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition active:scale-95 cursor-pointer',
              dialogState.type === 'danger'
                ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/30'
                : 'bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 shadow-amber-600/30'
            ]"
          >
            {{ dialogState.confirmText }}
          </button>
        </div>
      </div>
    </div>

    <!-- TOAST NOTIFICATIONS (Góc trên bên phải - Chuẩn Đẹp & Tương Phản Cao) -->
    <div class="fixed top-5 right-5 z-[1000] flex flex-col gap-2.5 pointer-events-none max-w-sm sm:max-w-md w-full px-3 sm:px-0">
      <div
        v-for="t in toasts"
        :key="t.id"
        :class="[
          'pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center justify-between gap-3 text-xs transition-all duration-300 transform animate-in slide-in-from-top-4 fade-in',
          t.type === 'error'
            ? 'bg-slate-950/95 text-rose-100 border-rose-500/50 shadow-rose-950/60 ring-1 ring-rose-500/20'
            : t.type === 'warning'
            ? 'bg-slate-950/95 text-amber-100 border-amber-500/50 shadow-amber-950/60 ring-1 ring-amber-500/20'
            : t.type === 'info'
            ? 'bg-slate-950/95 text-cyan-100 border-cyan-500/50 shadow-cyan-950/60 ring-1 ring-cyan-500/20'
            : 'bg-slate-950/95 text-emerald-100 border-emerald-500/50 shadow-emerald-950/60 ring-1 ring-emerald-500/20'
        ]"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            :class="[
              'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md',
              t.type === 'error'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : t.type === 'warning'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : t.type === 'info'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            ]"
          >
            <CheckCircle2 v-if="t.type === 'success' || !t.type" class="w-4 h-4" />
            <AlertCircle v-else-if="t.type === 'error'" class="w-4 h-4" />
            <AlertTriangle v-else-if="t.type === 'warning'" class="w-4 h-4" />
            <Info v-else class="w-4 h-4" />
          </div>

          <div class="space-y-0.5 min-w-0">
            <div class="text-[10px] font-black uppercase tracking-wider opacity-70">
              <span v-if="t.type === 'error'">Đã xảy ra lỗi</span>
              <span v-else-if="t.type === 'warning'">Cảnh báo</span>
              <span v-else-if="t.type === 'info'">Thông báo</span>
              <span v-else>Thành công</span>
            </div>
            <div class="font-bold text-xs sm:text-[13px] leading-snug break-words text-white">
              {{ cleanMessage(t.message) }}
            </div>
          </div>
        </div>

        <button
          @click="removeToast(t.id)"
          class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition cursor-pointer text-xs shrink-0"
          title="Đóng thông báo"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dialogState, handleConfirmDialog, toasts, removeToast } from '../utils/dialog';
import { AlertTriangle, Info, CheckCircle2, AlertCircle } from 'lucide-vue-next';

// Hàm làm sạch emoji dư thừa ở đầu câu nếu có
const cleanMessage = (msg) => {
  if (!msg) return '';
  return msg.replace(/^([✅🎉⚠️📋🛒❌\s]+)/, '').trim();
};
</script>
