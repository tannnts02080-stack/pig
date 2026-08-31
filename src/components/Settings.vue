<template>
  <div class="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
    <div class="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center text-white shadow-lg border border-slate-700">
        <Settings class="w-7 h-7" />
      </div>
      <div>
        <h1 class="text-2xl font-black text-white tracking-tight">Cài Đặt Cửa Hàng & Hệ Thống</h1>
        <p class="text-slate-400 text-sm">Cập nhật thông tin tổng kho heo, hotline và thông tin hiển thị trên hóa đơn</p>
      </div>
    </div>

    <div class="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Tên Cửa Hàng / Tổng Kho</label>
          <input
            type="text"
            v-model="form.shopName"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Khẩu Hiệu / Mô Tả</label>
          <input
            type="text"
            v-model="form.shopTagline"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Số Điện Thoại Hotline</label>
            <input
              type="text"
              v-model="form.phone"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Đơn Vị Tiền Tệ</label>
            <input
              type="text"
              v-model="form.currency"
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-300 mb-1">Địa Chỉ Tổng Kho</label>
          <input
            type="text"
            v-model="form.address"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-500"
          />
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            @click="handleResetCleanData"
            class="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition cursor-pointer"
          >
            🔄 Đồng Bộ & Làm Sạch Danh Mục Heo Chuẩn
          </button>

          <button
            type="submit"
            class="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition cursor-pointer"
          >
            Lưu Cài Đặt
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Settings } from 'lucide-vue-next';
import { showConfirm, showToast } from '../utils/dialog';

const props = defineProps({
  settings: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['refresh']);

const form = ref({
  shopName: props.settings.shopName || props.settings.tenCuaHang || 'TỔNG KHO BUÔN BÁN HEO SỮA',
  shopTagline: props.settings.shopTagline || props.settings.khauHieu || 'Heo Sữa Tươi Nóng & Cấp Đông Nguyên Con Chuẩn Sạch',
  phone: props.settings.phone || props.settings.soDienThoai || '0988.888.999',
  address: props.settings.address || props.settings.diaChi || 'TP. Hồ Chí Minh',
  currency: props.settings.currency || props.settings.donViTienTe || 'VNĐ'
});

watch(() => props.settings, (newVal) => {
  if (newVal) {
    form.value = {
      shopName: newVal.shopName || newVal.tenCuaHang || 'TỔNG KHO BUÔN BÁN HEO SỮA',
      shopTagline: newVal.shopTagline || newVal.khauHieu || 'Heo Sữa Tươi Nóng & Cấp Đông Nguyên Con Chuẩn Sạch',
      phone: newVal.phone || newVal.soDienThoai || '0988.888.999',
      address: newVal.address || newVal.diaChi || 'TP. Hồ Chí Minh',
      currency: newVal.currency || newVal.donViTienTe || 'VNĐ'
    };
  }
});

const handleSaveSettings = async () => {
  const payload = {
    shopName: form.value.shopName,
    tenCuaHang: form.value.shopName,
    shopTagline: form.value.shopTagline,
    khauHieu: form.value.shopTagline,
    phone: form.value.phone,
    soDienThoai: form.value.phone,
    address: form.value.address,
    diaChi: form.value.address,
    currency: form.value.currency,
    donViTienTe: form.value.currency
  };

  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast("✅ Đã lưu cài đặt hệ thống thành công!", "success");
      emit('refresh');
    }
  } catch (e) {
    showToast("Lỗi lưu cài đặt: " + e.message, "error");
  }
};

const handleResetCleanData = async () => {
  const confirmed = await showConfirm({
    title: 'Xác Nhận Khởi Tạo Lại Danh Mục',
    message: "Bạn có chắc chắn muốn dọn dẹp các món cũ và đồng bộ danh mục Heo Sữa Nguyên Con chuẩn sạch?",
    confirmText: 'Đồng Ý Đồng Bộ',
    cancelText: 'Hủy Bỏ',
    type: 'warning'
  });

  if (!confirmed) {
    return;
  }

  try {
    // 1. Cập nhật settings
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shopName: 'TỔNG KHO BUÔN BÁN HEO SỮA',
        tenCuaHang: 'TỔNG KHO BUÔN BÁN HEO SỮA',
        shopTagline: 'Heo Sữa Tươi Nóng & Cấp Đông Nguyên Con Chuẩn Sạch',
        khauHieu: 'Heo Sữa Tươi Nóng & Cấp Đông Nguyên Con Chuẩn Sạch',
        phone: '0988.888.999',
        soDienThoai: '0988.888.999',
        address: 'TP. Hồ Chí Minh',
        diaChi: 'TP. Hồ Chí Minh',
        currency: 'VNĐ',
        donViTienTe: 'VNĐ'
      })
    });

    // 2. Lấy danh sách sản phẩm hiện có
    const res = await fetch('/api/products');
    const products = await res.json();
    const safeProds = Array.isArray(products) ? products : (products?.data || []);

    // 3. Sửa hoặc tạo các món chuẩn
    const cleanStandardPigs = [
      {
        name: 'Heo Sữa Tươi Nóng Nguyên Con 5Kg',
        porkType: 'hot',
        sizeType: 'Heo 5Kg',
        costPrice: 800000,
        sellingPrice: 1200000,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        importDetails: 'Lô heo tươi mổ sáng sớm da trắng đẹp',
        headCount: 12
      },
      {
        name: 'Heo Sữa Tươi Nóng Size 7Kg',
        porkType: 'hot',
        sizeType: 'Heo 7Kg',
        costPrice: 1100000,
        sellingPrice: 1650000,
        image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
        importDetails: 'Lô heo tươi nóng thịt mềm thơm',
        headCount: 8
      },
      {
        name: 'Heo Sữa Cấp Đông Size Nhỏ 3Kg',
        porkType: 'cold',
        sizeType: 'Heo 3Kg',
        costPrice: 500000,
        sellingPrice: 780000,
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80',
        importDetails: 'Heo sữa cấp đông kho âm 18 độ C hút chân không',
        headCount: 10
      },
      {
        name: 'Heo Sữa Cấp Đông Chuẩn Size 4Kg',
        porkType: 'cold',
        sizeType: 'Heo 4Kg',
        costPrice: 650000,
        sellingPrice: 980000,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
        importDetails: 'Hàng đông lạnh kho lạnh bảo quản tốt',
        headCount: 15
      }
    ];

    // Cập nhật lại các sản phẩm cũ
    for (let i = 0; i < cleanStandardPigs.length; i++) {
      const pig = cleanStandardPigs[i];
      if (safeProds[i]) {
        await fetch(`/api/products/${safeProds[i].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...safeProds[i],
            name: pig.name,
            tenSanPham: pig.name,
            porkType: pig.porkType,
            loaiHeo: pig.porkType,
            sizeType: pig.sizeType,
            loaiSize: pig.sizeType,
            costPrice: pig.costPrice,
            giaNhapVon: pig.costPrice,
            sellingPrice: pig.sellingPrice,
            giaBanRa: pig.sellingPrice,
            image: pig.image,
            imageUrl: pig.image,
            hinhAnh: pig.image,
            importDetails: pig.importDetails,
            chiTietNhap: pig.importDetails,
            headCount: pig.headCount,
            soLuongCon: pig.headCount
          })
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pig)
        });
      }
    }

    showToast("✅ Đã làm sạch và đồng bộ danh mục heo sữa nguyên con thành công!", "success");
    emit('refresh');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (e) {
    showToast("Lỗi đồng bộ: " + e.message, "error");
  }
};
</script>
