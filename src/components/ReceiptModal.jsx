import React from 'react';
import { Printer, Copy, Check, X, QrCode, Snowflake } from 'lucide-react';
import { formatVND, formatDateTime, formatNumber } from '../utils/formatters';
import { getVietQRUrl } from '../utils/vietqr';

export default function ReceiptModal({ order, settings = {}, onClose }) {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyZalo = () => {
    let text = `🧊 *${settings.shopName || 'KHO HEO & ĐÔNG LẠNH PRO'}*\n`;
    text += `Đ/C: ${settings.address || ''}\n`;
    text += `Hotline: ${settings.phone || ''}\n`;
    text += `--------------------------------\n`;
    text += `HÓA ĐƠN BÁN HEO: #${order.id}\n`;
    text += `Ngày: ${formatDateTime(order.createdAt)}\n`;
    text += `Khách hàng: ${order.customerName}\n`;
    text += `--------------------------------\n`;
    
    order.items.forEach((item, index) => {
      const unitLabel = item.unitType === 'head' ? 'CON' : 'Kg';
      const qty = item.headCount || item.quantity;
      text += `${index + 1}. ${item.productName}\n`;
      text += `   ${qty} ${unitLabel} x ${formatVND(item.customPrice || item.originalPrice)} = ${formatVND(item.total)}\n`;
      if (item.itemDiscount > 0) {
        text += `   (Bớt: -${formatVND(item.itemDiscount)}/đv: ${item.discountReason || 'Heo xấu'})\n`;
      }
    });

    text += `--------------------------------\n`;
    text += `TỔNG TIỀN: ${formatVND(order.totalAmount)}\n`;
    if (order.discount > 0) {
      text += `Giảm giá đơn: -${formatVND(order.discount)}\n`;
    }
    text += `*THANH TOÁN: ${formatVND(order.finalAmount)}*\n`;
    text += `Đã trả: ${formatVND(order.paidAmount)}\n`;
    if (order.remainingDebt > 0) {
      text += `*CÒN GHI NỢ: ${formatVND(order.remainingDebt)}*\n`;
    }
    text += `Hình thức: ${order.paymentMethod === 'VietQR' ? 'Chuyển khoản VietQR' : order.paymentMethod === 'Cash' ? 'Tiền mặt' : 'Ghi nợ'}\n`;
    text += `--------------------------------\n`;
    text += `_Heo tươi sạch - chuẩn bảo quản đông lạnh -18°C!_\n`;
    text += `Cảm ơn Quý khách!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const qrUrl = getVietQRUrl({
    bankBin: settings.bankBin,
    bankAccount: settings.bankAccount,
    amount: order.remainingDebt > 0 ? order.remainingDebt : order.finalAmount,
    memo: `TT ${order.id}`,
    accountName: settings.bankHolder
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-sky-800/60 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Top Bar */}
        <div className="no-print bg-slate-800/80 px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-white text-base">Chi Tiết Hóa Đơn Bán Heo</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE RECEIPT CONTENT (Format chuẩn 80mm / A4) */}
        <div className="p-6 bg-white text-slate-900 max-h-[70vh] overflow-y-auto" id="printable-receipt">
          {/* Header */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <div className="flex items-center justify-center gap-1.5 font-black text-base uppercase text-slate-900 tracking-tight">
              <span>{settings.shopName || 'KHO HEO & ĐÔNG LẠNH PHÚC THỊNH'}</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">{settings.address || 'KCN Tân Bình, TP. HCM'}</p>
            <p className="text-[11px] text-slate-700 font-semibold">Hotline: {settings.phone || '0988.123.456'}</p>
          </div>

          {/* Bill Info */}
          <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1 text-slate-700">
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Mã đơn: #{order.id}</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span>Khách hàng:</span>
              <span className="font-bold text-slate-900">{order.customerName}</span>
            </div>
            {order.note && (
              <div className="text-[11px] italic text-slate-600 bg-slate-50 p-1 rounded">
                Ghi chú: {order.note}
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="py-3 border-b border-dashed border-slate-300">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                  <th className="pb-1">Loại heo / Hàng</th>
                  <th className="pb-1 text-center">SL</th>
                  <th className="pb-1 text-right">Đ.Giá</th>
                  <th className="pb-1 text-right">T.Tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => {
                  const qty = item.headCount || item.quantity;
                  const unitLabel = item.unitType === 'head' ? 'con' : 'kg';

                  return (
                    <tr key={idx} className="text-slate-800">
                      <td className="py-1.5 pr-1 font-medium">
                        <div>{item.productName}</div>
                        {item.itemDiscount > 0 && (
                          <span className="text-[10px] text-rose-600 block">
                            (Bớt -{formatNumber(item.itemDiscount)}đ: {item.discountReason || 'Heo xấu'})
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 text-center font-bold text-slate-700">
                        {qty} {unitLabel}
                      </td>
                      <td className="py-1.5 text-right text-slate-600">
                        {formatNumber(item.customPrice || item.originalPrice)}
                      </td>
                      <td className="py-1.5 text-right font-black text-slate-900">
                        {formatNumber(item.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Payment Summary */}
          <div className="py-3 space-y-1.5 text-xs text-slate-700 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span>Tổng tiền hàng:</span>
              <span className="font-semibold">{formatVND(order.totalAmount)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Chiết khấu giảm giá:</span>
                <span>-{formatVND(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>KHÁCH CẦN TRẢ:</span>
              <span className="text-sky-700">{formatVND(order.finalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Đã thanh toán ({order.paymentMethod}):</span>
              <span className="font-bold text-emerald-700">{formatVND(order.paidAmount)}</span>
            </div>
            {order.remainingDebt > 0 && (
              <div className="flex justify-between font-bold text-rose-600 bg-rose-50 p-1 rounded">
                <span>CÒN GHI NỢ:</span>
                <span>{formatVND(order.remainingDebt)}</span>
              </div>
            )}
          </div>

          {/* VietQR Bank Payment Code on Receipt */}
          {order.remainingDebt > 0 && (
            <div className="py-3 text-center border-b border-dashed border-slate-300">
              <p className="text-[11px] font-bold text-sky-800 uppercase mb-1.5">
                Quét mã QR thanh toán nợ ngân hàng
              </p>
              <img 
                src={qrUrl} 
                alt="Mã VietQR" 
                className="w-36 h-36 mx-auto border border-sky-300 rounded-lg p-1 bg-white shadow-sm"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                {settings.bankName} - STK: <span className="font-bold text-slate-800">{settings.bankAccount}</span> ({settings.bankHolder})
              </p>
            </div>
          )}

          {/* Footer Note */}
          <div className="text-center pt-3 text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-sky-800">❄️ {settings.printHeaderNote || 'Cam kết heo sạch chuẩn đông lạnh -18°C'}</p>
            <p>{settings.printFooterNote || 'Cảm ơn Quý khách & Hẹn gặp lại!'}</p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="no-print bg-slate-800/90 p-4 border-t border-slate-700 flex flex-wrap gap-2 justify-end">
          <button
            onClick={handleCopyZalo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép!' : 'Copy gửi Zalo'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-glow transition"
          >
            <Printer className="w-4 h-4" />
            <span>In Hóa Đơn (K80/A4)</span>
          </button>
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
}
