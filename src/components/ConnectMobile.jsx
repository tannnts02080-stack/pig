import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Wifi, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Sparkles,
  ExternalLink,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import { api } from '../utils/api';

export default function ConnectMobile() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const res = await api.getSystemInfo();
      setSystemInfo(res);
    } catch (err) {
      console.error('Lỗi lấy thông tin kết nối:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (!systemInfo?.mobileUrl) return;
    navigator.clipboard.writeText(systemInfo.mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="p-3 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24 lg:pb-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
          <Wifi className="w-3.5 h-3.5 animate-pulse" />
          Đồng Bộ Thời Gian Thực Qua Mạng Nội Bộ (LAN / WiFi)
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Kết Nối & Dùng Trên Điện Thoại Android
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Laptop đóng vai trò làm máy chủ trung tâm. Bạn có thể mở ứng dụng trên điện thoại Android, bán hàng, kiểm kho và in bill chung dữ liệu ngay lập tức!
        </p>
      </div>

      {/* QR Code & IP Display Box */}
      <div className="glass-panel p-6 rounded-3xl border border-sky-500/30 text-center space-y-4 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          
          {/* QR Container */}
          <div className="bg-white p-3 rounded-2xl shadow-glow border-2 border-sky-400">
            {systemInfo?.qrDataUrl ? (
              <img 
                src={systemInfo.qrDataUrl} 
                alt="Scan to open on Android" 
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-500 text-xs">
                {loading ? 'Đang tạo mã QR...' : 'Chưa có mã QR'}
              </div>
            )}
          </div>

          {/* Connection URL Details */}
          <div className="text-left space-y-3 max-w-xs">
            <div className="space-y-1">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Địa chỉ IP truy cập trên Android:
              </span>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm sm:text-base font-bold text-white break-all flex items-center justify-between gap-2">
                <span>{systemInfo?.mobileUrl || 'Đang tải...'}</span>
              </div>
            </div>

            <button
              onClick={handleCopyUrl}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
              <span>{copied ? 'Đã sao chép đường dẫn!' : 'Sao chép link mở trên điện thoại'}</span>
            </button>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <Laptop className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Laptop IP: {systemInfo?.localIp || 'localhost'} (Cổng {systemInfo?.port || 3000})</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3-STEP GUIDE FOR ANDROID */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Hướng Dẫn 3 Bước Cài Đặt Nhanh Lên Màn Hình Android
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Step 1 */}
          <div className="glass-card p-4 rounded-2xl border border-sky-900/40 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-black flex items-center justify-center text-sm border border-sky-500/30">
              1
            </div>
            <h4 className="font-bold text-white text-sm">Bắt chung 1 mạng WiFi</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Đảm bảo điện thoại Android và Laptop đang kết nối vào cùng 1 mạng WiFi của cửa hàng (hoặc phát 4G từ điện thoại cho laptop bắt).
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card p-4 rounded-2xl border border-sky-900/40 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-sm border border-emerald-500/30">
              2
            </div>
            <h4 className="font-bold text-white text-sm">Quét mã QR bằng Camera / Zalo</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mở Camera điện thoại hoặc Zalo quét mã QR phía trên, chọn <span className="text-emerald-300 font-bold">"Mở trong trình duyệt Chrome / Cốc Cốc"</span>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card p-4 rounded-2xl border border-sky-900/40 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/30">
              3
            </div>
            <h4 className="font-bold text-white text-sm">Thêm vào Màn hình chính (PWA)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trên Chrome, bấm biểu tượng <span className="font-bold text-white">dấu 3 chấm (⋮)</span> ở góc phải &rarr; Chọn <span className="text-amber-300 font-bold">"Cài đặt ứng dụng"</span> hoặc <span className="text-amber-300 font-bold">"Thêm vào Màn hình chính"</span>. Icon App sẽ xuất hiện như App tải từ CH Play!
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
