import { ref } from 'vue';

export const dialogState = ref({
  isOpen: false,
  title: 'Xác Nhận',
  message: '',
  confirmText: 'Xác Nhận',
  cancelText: 'Hủy Bỏ',
  type: 'confirm', // 'confirm' | 'alert' | 'danger'
  resolve: null
});

export const toasts = ref([]);

export const showConfirm = ({
  title = 'Xác Nhận Thao Tác',
  message = '',
  confirmText = 'Xác Nhận',
  cancelText = 'Hủy Bỏ',
  type = 'danger'
} = {}) => {
  return new Promise((resolve) => {
    dialogState.value = {
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      resolve
    };
  });
};

export const showAlert = ({
  title = 'Thông Báo',
  message = '',
  confirmText = 'Đã Hiểu',
  type = 'info'
} = {}) => {
  return new Promise((resolve) => {
    dialogState.value = {
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText: '',
      type,
      resolve
    };
  });
};

export const handleConfirmDialog = (confirmed) => {
  if (dialogState.value.resolve) {
    dialogState.value.resolve(confirmed);
  }
  dialogState.value.isOpen = false;
};

export const showToast = (message, type = 'success', duration = 3500) => {
  const id = Date.now() + Math.random();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, duration);
};

export const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id);
};
