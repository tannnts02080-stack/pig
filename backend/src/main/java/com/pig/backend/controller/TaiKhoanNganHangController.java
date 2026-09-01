package com.pig.backend.controller;

import com.pig.backend.domain.TaiKhoanNganHang;
import com.pig.backend.dto.ApiResponse;
import com.pig.backend.dto.TaiKhoanNganHangDTO;
import com.pig.backend.service.TaiKhoanNganHangService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/bank-accounts", "/api/v1/bank-accounts", "/api/tai-khoan-ngan-hang"})
@CrossOrigin(origins = "*")
public class TaiKhoanNganHangController {

    private final TaiKhoanNganHangService taiKhoanNganHangService;

    public TaiKhoanNganHangController(TaiKhoanNganHangService taiKhoanNganHangService) {
        this.taiKhoanNganHangService = taiKhoanNganHangService;
    }

    @GetMapping
    public ResponseEntity<List<TaiKhoanNganHang>> layTatCaTaiKhoan() {
        return ResponseEntity.ok(taiKhoanNganHangService.layTatCaTaiKhoan());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaiKhoanNganHang>> layChiTietTaiKhoan(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(taiKhoanNganHangService.layChiTietTaiKhoan(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaiKhoanNganHang>> themTaiKhoan(@RequestBody TaiKhoanNganHangDTO dto) {
        TaiKhoanNganHang tk = taiKhoanNganHangService.themTaiKhoan(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Thêm tài khoản ngân hàng thành công!", tk));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaiKhoanNganHang>> capNhatTaiKhoan(@PathVariable Long id, @RequestBody TaiKhoanNganHangDTO dto) {
        TaiKhoanNganHang tk = taiKhoanNganHangService.capNhatTaiKhoan(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật tài khoản ngân hàng thành công!", tk));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> xoaTaiKhoan(@PathVariable Long id) {
        try {
            taiKhoanNganHangService.xoaTaiKhoan(id);
            return ResponseEntity.ok(ApiResponse.ok("Đã xóa tài khoản ngân hàng thành công!", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không thể xóa tài khoản này vì đã có dữ liệu giao dịch hoặc phiếu nhập liên kết. Bạn có thể bấm Sửa để cập nhật thông tin!"));
        }
    }
}
