package com.pig.backend.controller;

import com.pig.backend.domain.DongTienNganHang;
import com.pig.backend.dto.ApiResponse;
import com.pig.backend.service.TaiKhoanNganHangService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping({
        "/api/bank-cash-flows", "/api/v1/bank-cash-flows",
        "/api/bank-transactions", "/api/v1/bank-transactions",
        "/api/debt-transactions", "/api/v1/debt-transactions",
        "/api/dong-tien-ngan-hang"
})
@CrossOrigin(origins = "*")
public class DongTienNganHangController {

    private final TaiKhoanNganHangService taiKhoanNganHangService;

    public DongTienNganHangController(TaiKhoanNganHangService taiKhoanNganHangService) {
        this.taiKhoanNganHangService = taiKhoanNganHangService;
    }

    @GetMapping
    public ResponseEntity<List<DongTienNganHang>> layLichSuDongTien(@RequestParam(required = false) Long accountId) {
        return ResponseEntity.ok(taiKhoanNganHangService.layLichSuDongTien(accountId));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DongTienNganHang>> ghiNhanDongTien(@RequestBody GiaoDichDongTienRequest req) {
        Long tkId = req.getTaiKhoanNganHangId() != null ? req.getTaiKhoanNganHangId() : req.getBankAccountId();
        String loai = req.getLoaiDongTien() != null ? req.getLoaiDongTien() : (req.getType() != null ? req.getType() : "IN");
        String lyDo = req.getLyDo() != null ? req.getLyDo() : (req.getReason() != null ? req.getReason() : "Giao dịch dòng tiền");
        BigDecimal soTien = req.getSoTien() != null ? req.getSoTien() : (req.getAmount() != null ? req.getAmount() : BigDecimal.ZERO);
        String loaiDoiTuong = req.getLoaiDoiTuong() != null ? req.getLoaiDoiTuong() : req.getTargetType();
        Long nccId = req.getNhaCungCapId() != null ? req.getNhaCungCapId() : req.getSupplierId();
        Long khId = req.getKhachHangId() != null ? req.getKhachHangId() : req.getCustomerId();
        String tenKh = req.getTenKhachHang() != null ? req.getTenKhachHang() : req.getCustomerName();
        String thangNam = req.getThangNam() != null ? req.getThangNam() : req.getMonthYear();
        String loaiNghiepVu = req.getLoaiNghiepVu() != null ? req.getLoaiNghiepVu() : req.getBusinessAction();

        DongTienNganHang dt = taiKhoanNganHangService.ghiNhanDongTienChiTiet(
                tkId, loai, soTien, lyDo, loaiDoiTuong, nccId, khId, tenKh, thangNam, loaiNghiepVu
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Ghi nhận giao dịch dòng tiền thành công!", dt));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> xoaTatCaDongTien() {
        taiKhoanNganHangService.xoaTatCaDongTien();
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa sạch toàn bộ lịch sử dòng tiền!", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> xoaDongTien(@PathVariable Long id) {
        taiKhoanNganHangService.xoaDongTien(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa dòng tiền thành công!", null));
    }

    public static class GiaoDichDongTienRequest {
        private Long taiKhoanNganHangId;
        private Long bankAccountId;
        private String loaiDongTien;
        private String type;
        private BigDecimal soTien;
        private BigDecimal amount;
        private String lyDo;
        private String reason;
        private String loaiDoiTuong;
        private String targetType;
        private Long nhaCungCapId;
        private Long supplierId;
        private Long khachHangId;
        private Long customerId;
        private String tenKhachHang;
        private String customerName;
        private String thangNam;
        private String monthYear;
        private String loaiNghiepVu;
        private String businessAction;

        public GiaoDichDongTienRequest() {}

        public Long getTaiKhoanNganHangId() { return taiKhoanNganHangId; }
        public void setTaiKhoanNganHangId(Long taiKhoanNganHangId) { this.taiKhoanNganHangId = taiKhoanNganHangId; }
        public Long getBankAccountId() { return bankAccountId; }
        public void setBankAccountId(Long bankAccountId) { this.bankAccountId = bankAccountId; }

        public String getLoaiDongTien() { return loaiDongTien; }
        public void setLoaiDongTien(String loaiDongTien) { this.loaiDongTien = loaiDongTien; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public BigDecimal getSoTien() { return soTien; }
        public void setSoTien(BigDecimal soTien) { this.soTien = soTien; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public String getLyDo() { return lyDo; }
        public void setLyDo(String lyDo) { this.lyDo = lyDo; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }

        public String getLoaiDoiTuong() { return loaiDoiTuong; }
        public void setLoaiDoiTuong(String loaiDoiTuong) { this.loaiDoiTuong = loaiDoiTuong; }
        public String getTargetType() { return targetType; }
        public void setTargetType(String targetType) { this.targetType = targetType; }

        public Long getNhaCungCapId() { return nhaCungCapId; }
        public void setNhaCungCapId(Long nhaCungCapId) { this.nhaCungCapId = nhaCungCapId; }
        public Long getSupplierId() { return supplierId; }
        public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

        public Long getKhachHangId() { return khachHangId; }
        public void setKhachHangId(Long khachHangId) { this.khachHangId = khachHangId; }
        public Long getCustomerId() { return customerId; }
        public void setCustomerId(Long customerId) { this.customerId = customerId; }

        public String getTenKhachHang() { return tenKhachHang; }
        public void setTenKhachHang(String tenKhachHang) { this.tenKhachHang = tenKhachHang; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }

        public String getThangNam() { return thangNam; }
        public void setThangNam(String thangNam) { this.thangNam = thangNam; }
        public String getMonthYear() { return monthYear; }
        public void setMonthYear(String monthYear) { this.monthYear = monthYear; }

        public String getLoaiNghiepVu() { return loaiNghiepVu; }
        public void setLoaiNghiepVu(String loaiNghiepVu) { this.loaiNghiepVu = loaiNghiepVu; }
        public String getBusinessAction() { return businessAction; }
        public void setBusinessAction(String businessAction) { this.businessAction = businessAction; }
    }
}
