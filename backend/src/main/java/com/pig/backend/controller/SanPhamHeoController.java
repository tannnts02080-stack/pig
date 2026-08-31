package com.pig.backend.controller;

import com.pig.backend.domain.SanPhamHeo;
import com.pig.backend.dto.ApiResponse;
import com.pig.backend.dto.SanPhamHeoDTO;
import com.pig.backend.service.SanPhamHeoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/products", "/api/v1/products", "/api/san-pham-heo"})
@CrossOrigin(origins = "*")
public class SanPhamHeoController {

    private final SanPhamHeoService sanPhamHeoService;

    public SanPhamHeoController(SanPhamHeoService sanPhamHeoService) {
        this.sanPhamHeoService = sanPhamHeoService;
    }

    @GetMapping
    public ResponseEntity<List<SanPhamHeo>> layTatCaSanPham() {
        return ResponseEntity.ok(sanPhamHeoService.layTatCaSanPham());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SanPhamHeo>> layChiTietSanPham(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(sanPhamHeoService.layChiTietSanPham(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SanPhamHeo>> themSanPham(@RequestBody SanPhamHeoDTO dto) {
        SanPhamHeo sp = sanPhamHeoService.themSanPham(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Thêm ô sản phẩm heo thành công!", sp));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SanPhamHeo>> capNhatSanPham(@PathVariable Long id, @RequestBody SanPhamHeoDTO dto) {
        SanPhamHeo sp = sanPhamHeoService.capNhatSanPham(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật ô sản phẩm heo thành công!", sp));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> xoaSanPham(@PathVariable Long id) {
        sanPhamHeoService.xoaSanPham(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa ô sản phẩm khỏi kho!", null));
    }

    @PostMapping("/{id}/adjust-stock")
    public ResponseEntity<ApiResponse<SanPhamHeo>> dieuChinhTonKho(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        SanPhamHeo sp = sanPhamHeoService.layChiTietSanPham(id);
        if (payload.containsKey("headCount") || payload.containsKey("soLuongCon")) {
            Object val = payload.getOrDefault("headCount", payload.get("soLuongCon"));
            sp.setSoLuongCon(Integer.parseInt(val.toString()));
        }
        if (payload.containsKey("stockKg") || payload.containsKey("soKgTonKho")) {
            Object val = payload.getOrDefault("stockKg", payload.get("soKgTonKho"));
            sp.setSoKgTonKho(new BigDecimal(val.toString()));
        }
        SanPhamHeoDTO dto = new SanPhamHeoDTO();
        dto.setSoLuongCon(sp.getSoLuongCon());
        dto.setSoKgTonKho(sp.getSoKgTonKho());
        SanPhamHeo capNhat = sanPhamHeoService.capNhatSanPham(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Điều chỉnh tồn kho thành công!", capNhat));
    }

    @PostMapping("/merge")
    public ResponseEntity<ApiResponse<List<SanPhamHeo>>> gopSanPham(@RequestBody Map<String, Object> payload) {
        List<Object> rawIds = (List<Object>) payload.get("productIds");
        List<Long> productIds = rawIds != null 
            ? rawIds.stream().map(o -> Long.parseLong(o.toString())).toList() 
            : List.of();
        
        BigDecimal giaBanRa = null;
        if (payload.containsKey("sellingPrice") && payload.get("sellingPrice") != null) {
            giaBanRa = new BigDecimal(payload.get("sellingPrice").toString());
        }
        String nhomGopId = (String) payload.get("targetGroupId");

        List<SanPhamHeo> result = sanPhamHeoService.gopSanPham(productIds, giaBanRa, nhomGopId);
        return ResponseEntity.ok(ApiResponse.ok("Đã gộp các lô sản phẩm thành công!", result));
    }

    @PostMapping("/unmerge")
    public ResponseEntity<ApiResponse<List<SanPhamHeo>>> tachSanPham(@RequestBody Map<String, Object> payload) {
        Long productId = payload.containsKey("productId") && payload.get("productId") != null
            ? Long.parseLong(payload.get("productId").toString())
            : null;
        String nhomGopId = (String) payload.get("groupId");

        List<SanPhamHeo> result = sanPhamHeoService.tachSanPham(productId, nhomGopId);
        return ResponseEntity.ok(ApiResponse.ok("Đã tách lô sản phẩm thành công!", result));
    }
}
