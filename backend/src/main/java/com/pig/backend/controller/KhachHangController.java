package com.pig.backend.controller;

import com.pig.backend.domain.KhachHang;
import com.pig.backend.dto.ApiResponse;
import com.pig.backend.repository.KhachHangRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/customers", "/api/v1/customers", "/api/khach-hang"})
@CrossOrigin(origins = "*")
public class KhachHangController {

    private final KhachHangRepository khachHangRepository;

    public KhachHangController(KhachHangRepository khachHangRepository) {
        this.khachHangRepository = khachHangRepository;
    }

    @GetMapping
    public ResponseEntity<List<KhachHang>> layTatCa() {
        return ResponseEntity.ok(khachHangRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<KhachHang>> themMoi(@RequestBody KhachHang kh) {
        if (kh.getTenKhachHang() == null && kh.getName() != null) {
            kh.setTenKhachHang(kh.getName());
        }
        KhachHang daLuu = khachHangRepository.save(kh);
        return ResponseEntity.ok(ApiResponse.ok("Thêm khách hàng thành công!", daLuu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KhachHang>> capNhat(@PathVariable Long id, @RequestBody KhachHang kh) {
        kh.setId(id);
        KhachHang daLuu = khachHangRepository.save(kh);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật khách hàng thành công!", daLuu));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> xoa(@PathVariable Long id) {
        khachHangRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa khách hàng!", null));
    }

    @PostMapping("/{id}/repay")
    public ResponseEntity<ApiResponse<KhachHang>> thuNoKhachHang(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        KhachHang kh = khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng ID: " + id));
        if (payload.containsKey("amount") || payload.containsKey("soTien")) {
            Object val = payload.getOrDefault("amount", payload.get("soTien"));
            BigDecimal soTien = new BigDecimal(val.toString());
            kh.setCongNoHienTai(kh.getCongNoHienTai().subtract(soTien).max(BigDecimal.ZERO));
            khachHangRepository.save(kh);
        }
        return ResponseEntity.ok(ApiResponse.ok("Thu nợ thành công!", kh));
    }
}
