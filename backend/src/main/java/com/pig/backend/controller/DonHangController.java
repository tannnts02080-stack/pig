package com.pig.backend.controller;

import com.pig.backend.domain.DonHang;
import com.pig.backend.dto.ApiResponse;
import com.pig.backend.dto.TaoDonHangRequest;
import com.pig.backend.dto.TraHangRequest;
import com.pig.backend.service.DonHangService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/orders", "/api/v1/orders", "/api/don-hang"})
@CrossOrigin(origins = "*")
public class DonHangController {

    private final DonHangService donHangService;

    public DonHangController(DonHangService donHangService) {
        this.donHangService = donHangService;
    }

    @GetMapping
    public ResponseEntity<List<DonHang>> layTatCaDonHang() {
        return ResponseEntity.ok(donHangService.layTatCaDonHang());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DonHang>> layChiTietDonHang(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(donHangService.layChiTietDonHang(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DonHang>> taoDonHang(@RequestBody TaoDonHangRequest request) {
        DonHang donHang = donHangService.taoDonHang(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Tạo đơn hàng & tính lợi nhuận thành công!", donHang));
    }

    @PostMapping({"/{id}/return", "/{id}/tra-hang"})
    public ResponseEntity<ApiResponse<DonHang>> traHang(@PathVariable Long id, @RequestBody TraHangRequest request) {
        DonHang donHang = donHangService.traHang(id, request);
        return ResponseEntity.ok(ApiResponse.ok("✅ Đã xử lý trả hàng, hoàn tiền cho khách, cộng lại kho và đối soát trừ tiền NCC thành công!", donHang));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> huyDonHang(@PathVariable Long id) {
        donHangService.huyDonHang(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã hủy đơn hàng và hoàn lại số lượng heo vào kho!", null));
    }
}
