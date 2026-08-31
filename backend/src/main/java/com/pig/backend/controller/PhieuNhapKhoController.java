package com.pig.backend.controller;

import com.pig.backend.domain.PhieuNhapKho;
import com.pig.backend.dto.ApiResponse;
import com.pig.backend.dto.TaoPhieuNhapRequest;
import com.pig.backend.service.PhieuNhapKhoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/purchases", "/api/v1/purchases", "/api/phieu-nhap-kho"})
@CrossOrigin(origins = "*")
public class PhieuNhapKhoController {

    private final PhieuNhapKhoService phieuNhapKhoService;

    public PhieuNhapKhoController(PhieuNhapKhoService phieuNhapKhoService) {
        this.phieuNhapKhoService = phieuNhapKhoService;
    }

    @GetMapping
    public ResponseEntity<List<PhieuNhapKho>> layTatCaPhieuNhap() {
        return ResponseEntity.ok(phieuNhapKhoService.layTatCaPhieuNhap());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PhieuNhapKho>> taoPhieuNhap(@RequestBody TaoPhieuNhapRequest request) {
        PhieuNhapKho phieu = phieuNhapKhoService.taoPhieuNhap(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Tạo phiếu nhập kho thành công (đã cộng kho & tính tiền xe)!", phieu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PhieuNhapKho>> capNhatPhieuNhap(
            @PathVariable Long id,
            @RequestBody TaoPhieuNhapRequest request
    ) {
        PhieuNhapKho phieu = phieuNhapKhoService.capNhatPhieuNhap(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật chuyến xe nhập kho thành công!", phieu));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> xoaPhieuNhap(@PathVariable Long id) {
        phieuNhapKhoService.xoaPhieuNhap(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa phiếu nhập kho thành công!", null));
    }
}
