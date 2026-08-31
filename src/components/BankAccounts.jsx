import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Edit2, Trash2, ArrowDownLeft, ArrowUpRight, 
  Search, RefreshCw, DollarSign, CreditCard, ShieldCheck, FileText, CheckCircle2 
} from 'lucide-react';
import { formatVND, formatDateTime, formatDate } from '../utils/formatters';

const POPULAR_BANKS = [
  { code: 'MB', name: 'MB BANK (Quân Đội)' },
  { code: 'VCB', name: 'VIETCOMBANK' },
  { code: 'TCB', name: 'TECHCOMBANK' },
  { code: 'BIDV', name: 'BIDV' },
  { code: 'CTG', name: 'VIETINBANK' },
  { code: 'ACB', name: 'ACB' },
  { code: 'VPB', name: 'VPBANK' },
  { code: 'TPB', name: 'TPBANK' },
  { code: 'STB', name: 'SACOMBANK' },
  { code: 'HDB', name: 'HDBANK' }
];

export default function BankAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  // Form thêm / sửa tài khoản
  const [form, setForm] = useState({
    bankName: 'MB BANK (Quân Đội)',
    bankCode: 'MB',
    accountNumber: '',
    accountHolder: '',
    balance: '',
    notes: ''
  });

  // Form nạp / rút / chi phí thủ công
  const [txForm, setTxForm] = useState({
    bankAccountId: '',
    type: 'IN',
    amount: '',
    reason: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accRes, txRes] = await Promise.all([
        fetch('/api/bank-accounts').catch(() => null),
        fetch('/api/bank-transactions').catch(() => null)
      ]);
      const accData = accRes && accRes.ok ? await accRes.json() : [];
      const txData = txRes && txRes.ok ? await txRes.json() : [];

      const safeAccs = Array.isArray(accData) ? accData : (accData?.data && Array.isArray(accData.data) ? accData.data : []);
      const safeTxs = Array.isArray(txData) ? txData : (txData?.data && Array.isArray(txData.data) ? txData.data : []);

      setAccounts(safeAccs);
      setTransactions(safeTxs);
      if (safeAccs.length > 0 && !txForm.bankAccountId) {
        setTxForm(prev => ({ ...prev, bankAccountId: safeAccs[0].id }));
      }
    } catch (e) {
      console.error("Lỗi tải dữ liệu tài khoản:", e);
      setAccounts([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingAccount(null);
    setForm({
      bankName: 'MB BANK (Quân Đội)',
      bankCode: 'MB',
      accountNumber: '',
      accountHolder: '',
      balance: '',
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (acc) => {
    setEditingAccount(acc);
    setForm({
      bankName: acc.bankName || acc.tenNganHang,
      bankCode: acc.bankCode || acc.maNganHang || 'MB',
      accountNumber: acc.accountNumber || acc.soTaiKhoan,
      accountHolder: acc.accountHolder || acc.chuTaiKhoan,
      balance: acc.balance || acc.soDuHienTai,
      notes: acc.notes || acc.ghiChu || ''
    });
    setShowModal(true);
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    if (!form.bankName || !form.accountNumber || !form.accountHolder) {
      alert("Vui lòng điền đầy đủ Tên Ngân Hàng, STK và Tên Chủ Tài Khoản!");
      return;
    }

    const payload = {
      bankName: form.bankName,
      tenNganHang: form.bankName,
      bankCode: form.bankCode,
      maNganHang: form.bankCode,
      accountNumber: form.accountNumber,
      soTaiKhoan: form.accountNumber,
      accountHolder: form.accountHolder.toUpperCase(),
      chuTaiKhoan: form.accountHolder.toUpperCase(),
      balance: Number(form.balance) || 0,
      soDuHienTai: Number(form.balance) || 0,
      notes: form.notes,
      ghiChu: form.notes
    };

    try {
      if (editingAccount) {
        const res = await fetch(`/api/bank-accounts/${editingAccount.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setShowModal(false);
          fetchData();
        }
      } else {
        const res = await fetch('/api/bank-accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setShowModal(false);
          fetchData();
        }
      }
    } catch (err) {
      alert("Lỗi kết nối: " + err.message);
    }
  };

  const handleDeleteAccount = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${name}?`)) return;
    try {
      const res = await fetch(`/api/bank-accounts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert("Không thể xóa tài khoản đã có lịch sử giao dịch dòng tiền");
      }
    } catch (e) {
      alert("Lỗi xóa tài khoản: " + e.message);
    }
  };

  const handleSaveTx = async (e) => {
    e.preventDefault();
    if (!txForm.bankAccountId || !txForm.amount || Number(txForm.amount) <= 0) {
      alert("Vui lòng chọn tài khoản và nhập số tiền hợp lệ!");
      return;
    }

    const payload = {
      bankAccountId: Number(txForm.bankAccountId),
      type: txForm.type, // 'IN' hoặc 'OUT'
      amount: Number(txForm.amount),
      reason: txForm.reason || (txForm.type === 'IN' ? 'Nạp tiền vào tài khoản' : 'Rút tiền chi phí'),
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/bank-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowTxModal(false);
        setTxForm({ ...txForm, amount: '', reason: '' });
        fetchData();
      } else {
        alert("Không thể tạo giao dịch");
      }
    } catch (e) {
      alert("Lỗi kết nối: " + e.message);
    }
  };

  // Tính tổng số dư tất cả tài khoản
  const totalBalance = accounts.reduce((s, a) => s + (Number(a.balance || a.soDuHienTai) || 0), 0);

  // Lọc lịch sử giao dịch
  const filteredTxs = transactions.filter(t => {
    if (selectedAccountId === 'ALL') return true;
    return String(t.bankAccountId) === String(selectedAccountId) || String(t.taiKhoanNganHang?.id) === String(selectedAccountId);
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-600/30 ring-1 ring-white/20">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                Quản Lý Tài Khoản Ngân Hàng & Sổ Dòng Tiền
              </h1>
              <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {accounts.length} TÀI KHOẢN
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Quản lý danh sách STK ngân hàng thụ hưởng, theo dõi dòng tiền vào (+) từ khách mua và dòng tiền ra (-) trả tiền heo & tiền xe
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={fetchData}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700/60 shadow-md transition"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowTxModal(true)}
            className="flex items-center gap-1.5 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold rounded-2xl transition shadow-md"
          >
            <DollarSign className="w-4 h-4" />
            <span>Nạp / Rút Thủ Công</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-cyan-600/30 transition border border-cyan-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Tài Khoản Mới</span>
          </button>
        </div>
      </div>

      {/* TỔNG QUAN SỐ DƯ TẤT CẢ TÀI KHOẢN */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-black text-cyan-400 tracking-wider">TỔNG SỐ DƯ KHẢ DỤNG TOÀN HỆ THỐNG</span>
          <div className="text-3xl lg:text-4xl font-black text-white mt-1">
            {formatVND(totalBalance)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Dòng tiền sẵn sàng luân chuyển thanh toán tiền nhập heo và chi phí xe
          </span>
        </div>
      </div>

      {/* DANH SÁCH THẺ TÀI KHOẢN NGÂN HÀNG */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => {
          const balance = Number(acc.balance || acc.soDuHienTai || 0);
          const bankName = acc.bankName || acc.tenNganHang;
          const accNo = acc.accountNumber || acc.soTaiKhoan;
          const holder = acc.accountHolder || acc.chuTaiKhoan;

          return (
            <div
              key={acc.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 shadow-xl relative flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base">{bankName}</h3>
                    <p className="text-xs font-mono text-cyan-400 font-bold mt-0.5">{accNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(acc)}
                    className="p-1.5 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 rounded-lg transition"
                    title="Sửa tài khoản"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(acc.id, `${bankName} - ${accNo}`)}
                    className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition"
                    title="Xóa tài khoản"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500">Chủ Tài Khoản</div>
                <div className="text-sm font-bold text-slate-200 uppercase">{holder}</div>

                <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Số Dư Hiện Tại:</span>
                  <span className="text-lg font-black text-emerald-400">{formatVND(balance)}</span>
                </div>
              </div>

              {acc.notes && (
                <p className="text-[11px] text-slate-500 italic truncate">
                  "{acc.notes}"
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* SỔ DÒNG TIỀN RA / VÀO (TRANSACTIONS) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-black text-white">Sổ Dòng Tiền Ra & Vào Ngân Hàng</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Lọc theo TK:</span>
            <select
              value={selectedAccountId}
              onChange={e => setSelectedAccountId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
            >
              <option value="ALL">Tất cả tài khoản</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>
                  {a.bankName} - {a.accountNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-black border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Thời Gian</th>
                <th className="px-4 py-3.5">Tài Khoản</th>
                <th className="px-4 py-3.5">Loại Dòng Tiền</th>
                <th className="px-4 py-3.5 text-right">Số Tiền</th>
                <th className="px-5 py-3.5">Nội Dung / Lý Do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-slate-500 italic">
                    Chưa có giao dịch dòng tiền nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx, idx) => {
                  const isIncoming = tx.type === 'IN' || tx.loaiGiaoDich === 'IN';
                  const amount = Number(tx.amount || tx.soTienGiaoDich || 0);

                  return (
                    <tr key={tx.id || idx} className="hover:bg-slate-800/40 transition">
                      <td className="px-5 py-3.5 font-mono text-slate-400">
                        {formatDateTime(tx.createdAt || tx.thoiGianGiaoDich)}
                      </td>

                      <td className="px-4 py-3.5 font-bold text-white">
                        {tx.bankAccountName || tx.taiKhoanNganHang?.tenNganHang || 'MB Bank'}
                      </td>

                      <td className="px-4 py-3.5">
                        {isIncoming ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                            Tiền Vào (+)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            <ArrowUpRight className="w-3 h-3 text-rose-400" />
                            Tiền Ra (-)
                          </span>
                        )}
                      </td>

                      <td className={`px-4 py-3.5 text-right font-black text-sm ${isIncoming ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isIncoming ? '+' : '-'}{formatVND(amount)}
                      </td>

                      <td className="px-5 py-3.5 text-slate-300">
                        {tx.reason || tx.noiDung || 'Giao dịch hệ thống'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL THÊM / SỬA TÀI KHOẢN */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white">
              {editingAccount ? 'Chỉnh Sửa Tài Khoản Ngân Hàng' : 'Thêm Tài Khoản Ngân Hàng Mới'}
            </h3>

            <form onSubmit={handleSaveAccount} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Chọn Ngân Hàng</label>
                <select
                  value={form.bankCode}
                  onChange={e => {
                    const b = POPULAR_BANKS.find(x => x.code === e.target.value);
                    setForm({ ...form, bankCode: e.target.value, bankName: b?.name || e.target.value });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  {POPULAR_BANKS.map(b => (
                    <option key={b.code} value={b.code}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Số Tài Khoản (STK) *</label>
                <input
                  type="text"
                  required
                  value={form.accountNumber}
                  onChange={e => setForm({ ...form, accountNumber: e.target.value })}
                  placeholder="0988..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tên Chủ Tài Khoản *</label>
                <input
                  type="text"
                  required
                  value={form.accountHolder}
                  onChange={e => setForm({ ...form, accountHolder: e.target.value.toUpperCase() })}
                  placeholder="NGUYEN VAN A"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Số Dư Khởi Tạo (VNĐ)</label>
                <input
                  type="number"
                  value={form.balance}
                  onChange={e => setForm({ ...form, balance: e.target.value })}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Ghi Chú</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Tài khoản chuyên thu tiền bán..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl"
                >
                  Lưu Tài Khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NẠP / RÚT THỦ CÔNG */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-white">Thêm Giao Dịch Dòng Tiền Thủ Công</h3>

            <form onSubmit={handleSaveTx} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Chọn Tài Khoản Ngân Hàng</label>
                <select
                  value={txForm.bankAccountId}
                  onChange={e => setTxForm({ ...txForm, bankAccountId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.bankName} - {a.accountNumber} ({a.accountHolder})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Loại Giao Dịch</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxForm({ ...txForm, type: 'IN' })}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      txForm.type === 'IN' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    + Nạp Tiền Vào
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxForm({ ...txForm, type: 'OUT' })}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      txForm.type === 'OUT' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    - Rút Tiền Chi
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Số Tiền (VNĐ) *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  step="1000"
                  value={txForm.amount}
                  onChange={e => setTxForm({ ...txForm, amount: e.target.value })}
                  placeholder="1000000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nội Dung / Lý Do</label>
                <input
                  type="text"
                  value={txForm.reason}
                  onChange={e => setTxForm({ ...txForm, reason: e.target.value })}
                  placeholder="VD: Rút tiền trả tiền xe ngoài / Nạp tiền vào..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTxModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl"
                >
                  Ghi Nhận Giao Dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
