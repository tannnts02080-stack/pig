// VietQR Generator Utility
// Generates standard VietQR images using bank BIN, account number, amount, and order code

export function getVietQRUrl({ bankBin = "970422", bankAccount = "0988123456888", amount = 0, memo = "", accountName = "NGUYEN PHUC THINH", template = "compact2" }) {
  const cleanAccount = (bankAccount || '').replace(/\s+/g, '');
  const cleanBin = bankBin || '970422'; // MBBank default
  const cleanAmount = Math.round(Number(amount) || 0);
  const cleanMemo = encodeURIComponent((memo || '').slice(0, 50));
  const cleanName = encodeURIComponent(accountName || '');

  // VietQR public API
  return `https://img.vietqr.io/image/${cleanBin}-${cleanAccount}-${template}.png?amount=${cleanAmount}&addInfo=${cleanMemo}&accountName=${cleanName}`;
}

export function generateVietQRUrl({ bankId = "MB", accountNo = "", amount = 0, description = "", template = "compact2" }) {
  const bank = VIETNAM_BANKS.find(b => b.shortName.toUpperCase().includes((bankId || '').toUpperCase()) || b.bin === bankId);
  const bin = bank ? bank.bin : '970422';
  return getVietQRUrl({
    bankBin: bin,
    bankAccount: accountNo,
    amount: amount,
    memo: description,
    template: template
  });
}

export const VIETNAM_BANKS = [
  { bin: "970422", shortName: "MBBANK", name: "Ngân hàng Quân Đội" },
  { bin: "970436", shortName: "VIETCOMBANK", name: "Ngoại Thương Việt Nam" },
  { bin: "970415", shortName: "VIETINBANK", name: "Công Thương Việt Nam" },
  { bin: "970418", shortName: "BIDV", name: "Đầu Tư và Phát Triển VN" },
  { bin: "970407", shortName: "TECHCOMBANK", name: "Kỹ Thương Việt Nam" },
  { bin: "970423", shortName: "TPBANK", name: "Tiên Phong" },
  { bin: "970432", shortName: "VPBANK", name: "Việt Nam Thịnh Vượng" },
  { bin: "970405", shortName: "AGRIBANK", name: "Nông Nghiệp & PT Nông Thôn" },
  { bin: "970403", shortName: "SACOMBANK", name: "Sài Gòn Thương Tín" },
  { bin: "970441", shortName: "VIB", name: "Quốc Tế Việt Nam" },
  { bin: "970416", shortName: "ACB", name: "Á Châu" },
  { bin: "970448", shortName: "OCB", name: "Phương Đông" },
  { bin: "970428", shortName: "NAMABANK", name: "Nam Á" },
  { bin: "970443", shortName: "SHB", name: "Sài Gòn - Hà Nội" },
  { bin: "970437", shortName: "HDBANK", name: "Phát Triển TP.HCM" }
];
