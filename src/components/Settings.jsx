import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Store, 
  CreditCard, 
  Bell, 
  Database, 
  Download, 
  Upload, 
  CheckCircle2, 
  Save,
  QrCode
} from 'lucide-react';
import { VIETNAM_BANKS, getVietQRUrl } from '../utils/vietqr';
import { api } from '../utils/api';

export default function Settings({ settings = {}, onRefresh }) {
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleBankChange = (e) => {
    const selectedBin = e.target.value;
    const bank = VIETNAM_BANKS.find(b => b.bin === selectedBin);
    setFormData({
      ...formData,
      bankBin: selectedBin,
      bankName: bank ? bank.shortName : formData.bankName
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.updateSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert('Lỗi lưu cài đặt: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadBackup = () => {
    window.open('/api/backup/export', '_blank');
  };

  const handleRestoreBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = event.target?.result;
        const res = await api.restoreBackup(json);
        if (res.success) {
          alert('Khôi phục dữ liệu thành công!');
          if (onRefresh) onRefresh();
        } else {
          alert('Lỗi khôi phục: ' + res.message);
        }
      } catch (err) {
        alert('File sao lưu không hợp lệ: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Preview VietQR
  const previewQrUrl = getVietQRUrl({
    bankBin: formData.bankBin,
    bankAccount: formData.bankAccount,
    amount: 100000,
    memo: 'TEST QR DONG LANH',
    accountName: formData.bankHolder
  });

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24 lg:pb-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-sky-400" />
            Cài Đặt Hệ Thống & Tài Khoản Ngân Hàng VietQR
          </h2>
          <p className="text-xs text-slate-400">
            Tùy chỉnh thông tin cửa hàng, tài khoản nhận tiền quét mã QR và sao lưu dữ liệu
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã lưu thành công!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        
        {/* 1. THÔNG TIN CỬA HÀNG / TỔNG KHO */}
        <div className="glass-panel p-5 rounded-2xl border border-sky-900/40 space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm border-b border-slate-800 pb-2">
            <Store className="w-4 h-4" />
            <span>1. Thông Tin Kho / Cửa Hàng (Hiển thị trên Hóa Đơn)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Tên Kho / Cửa Hàng: *</label>
              <input
                type="text"
                required
                value={formData.shopName || ''}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Khẩu hiệu / Giới thiệu:</label>
              <input
                type="text"
                value={formData.shopTagline || ''}
                onChange={(e) => setFormData({ ...formData, shopTagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Số điện thoại / Hotline: *</label>
              <input
                type="text"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Địa chỉ kho hàng:</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* 2. CẤU HÌNH TÀI KHOẢN NGÂN HÀNG VIETQR */}
        <div className="glass-panel p-5 rounded-2xl border border-sky-900/40 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-2">
            <CreditCard className="w-4 h-4" />
            <span>2. Cấu Hình Tài Khoản Nhận Tiền VietQR (Tự Động Sinh Mã QR)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            
            <div className="sm:col-span-2 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Chọn Ngân Hàng:</label>
                <select
                  value={formData.bankBin || '970422'}
                  onChange={handleBankChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-semibold"
                >
                  {VIETNAM_BANKS.map((b) => (
                    <option key={b.bin} value={b.bin}>
                      {b.shortName} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Số Tài Khoản Ngân Hàng: *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: 0988123456"
                  value={formData.bankAccount || ''}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-mono font-bold text-sky-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tên Chủ Tài Khoản (Không dấu): *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: NGUYEN PHUC THINH"
                  value={formData.bankHolder || ''}
                  onChange={(e) => setFormData({ ...formData, bankHolder: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-bold uppercase"
                />
              </div>
            </div>

            {/* Live QR Preview */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Mã QR Mẫu</span>
              <img 
                src={previewQrUrl} 
                alt="QR Preview" 
                className="w-32 h-32 mx-auto rounded-lg bg-white p-1 border border-slate-700" 
              />
              <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                {formData.bankName} - {formData.bankAccount}
              </span>
            </div>

          </div>
        </div>

        {/* 3. CẢNH BÁO TỒN KHO & HẠN DÙNG */}
        <div className="glass-panel p-5 rounded-2xl border border-sky-900/40 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-800 pb-2">
            <Bell className="w-4 h-4" />
            <span>3. Cấu Hình Ngưỡng Cảnh Báo Kho & Hạn Dùng</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Báo động tồn kho thấp khi dưới (Kg):
              </label>
              <input
                type="number"
                value={formData.lowStockThreshold || 20}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Báo động hàng cận Date trước (Số ngày):
              </label>
              <input
                type="number"
                value={formData.nearExpiryDays || 30}
                onChange={(e) => setFormData({ ...formData, nearExpiryDays: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* 4. SAO LƯU & KHÔI PHỤC DỮ LIỆU */}
        <div className="glass-panel p-5 rounded-2xl border border-sky-900/40 space-y-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm border-b border-slate-800 pb-2">
            <Database className="w-4 h-4" />
            <span>4. Sao Lưu & Khôi Phục Dữ Liệu An Toàn</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Tải File Sao Lưu (.JSON) Về Máy</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 cursor-pointer transition">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Khôi Phục Dữ Liệu Từ File JSON</span>
              <input type="file" accept=".json" onChange={handleRestoreBackup} className="hidden" />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-glow flex items-center gap-2 transition active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'ĐANG LƯU...' : 'LƯU TẤT CẢ CÀI ĐẶT'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
