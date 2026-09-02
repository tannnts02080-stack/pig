package com.pig.backend.controller;

import com.pig.backend.domain.NhaCungCap;
import com.pig.backend.dto.ApiResponse;
import com.pig.backend.repository.NhaCungCapRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/suppliers", "/api/v1/suppliers", "/api/nha-cung-cap"})
@CrossOrigin(origins = "*")
public class NhaCungCapController {

    private final NhaCungCapRepository nhaCungCapRepository;
    private final JdbcTemplate jdbcTemplate;

    public NhaCungCapController(NhaCungCapRepository nhaCungCapRepository, JdbcTemplate jdbcTemplate) {
        this.nhaCungCapRepository = nhaCungCapRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<List<NhaCungCap>> layTatCa() {
        return ResponseEntity.ok(nhaCungCapRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhaCungCap> layTheoId(@PathVariable Long id) {
        return nhaCungCapRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NhaCungCap>> themMoi(@RequestBody NhaCungCap ncc) {
        if (ncc.getMaNhaCungCap() == null || ncc.getMaNhaCungCap().isBlank()) {
            ncc.setMaNhaCungCap("SUP-" + (System.currentTimeMillis() % 10000));
        }
        if (ncc.getTenNhaCungCap() == null && ncc.getName() != null) {
            ncc.setTenNhaCungCap(ncc.getName());
        }
        NhaCungCap daLuu = nhaCungCapRepository.save(ncc);
        return ResponseEntity.ok(ApiResponse.ok("Thêm nhà cung cấp thành công!", daLuu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<NhaCungCap>> capNhat(@PathVariable Long id, @RequestBody NhaCungCap ncc) {
        ncc.setId(id);
        NhaCungCap daLuu = nhaCungCapRepository.save(ncc);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật nhà cung cấp thành công!", daLuu));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<Void>> xoa(@PathVariable Long id) {
        try {
            // 1. Gỡ liên kết / xóa chi tiết phiếu nhập của các phiếu nhập thuộc NCC này
            try {
                jdbcTemplate.update("DELETE FROM chi_tiet_phieu_nhap WHERE phieu_nhap_kho_id IN (SELECT id FROM phieu_nhap_kho WHERE nha_cung_cap_id = ?)", id);
            } catch (Exception ignored) {}

            // 2. Xóa các phiếu nhập kho của NCC này
            try {
                jdbcTemplate.update("DELETE FROM phieu_nhap_kho WHERE nha_cung_cap_id = ?", id);
            } catch (Exception ignored) {}

            // 3. Gỡ liên kết sản phẩm heo thuộc NCC này
            try {
                jdbcTemplate.update("UPDATE san_pham_heo SET nha_cung_cap_id = NULL WHERE nha_cung_cap_id = ?", id);
            } catch (Exception ignored) {}

            // 4. Gỡ liên kết tài khoản ngân hàng của NCC này
            try {
                jdbcTemplate.update("UPDATE tai_khoan_ngan_hang SET nha_cung_cap_id = NULL WHERE nha_cung_cap_id = ?", id);
            } catch (Exception ignored) {}

            // 5. Gỡ liên kết dòng tiền ngân hàng của NCC này
            try {
                jdbcTemplate.update("UPDATE dong_tien_ngan_hang SET nha_cung_cap_id = NULL WHERE nha_cung_cap_id = ?", id);
            } catch (Exception ignored) {}

            // 6. Xóa nhà cung cấp
            nhaCungCapRepository.deleteById(id);
            return ResponseEntity.ok(ApiResponse.ok("Đã xóa nhà cung cấp thành công!", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Lỗi khi xóa nhà cung cấp: " + e.getMessage()));
        }
    }
}
