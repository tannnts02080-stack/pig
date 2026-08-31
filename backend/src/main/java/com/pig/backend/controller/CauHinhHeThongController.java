package com.pig.backend.controller;

import com.pig.backend.domain.CauHinhHeThong;
import com.pig.backend.dto.ApiResponse;
import com.pig.backend.repository.CauHinhHeThongRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/settings", "/api/v1/settings", "/api/cau-hinh-he-thong"})
@CrossOrigin(origins = "*")
public class CauHinhHeThongController {

    private final CauHinhHeThongRepository cauHinhHeThongRepository;

    public CauHinhHeThongController(CauHinhHeThongRepository cauHinhHeThongRepository) {
        this.cauHinhHeThongRepository = cauHinhHeThongRepository;
    }

    @GetMapping
    public ResponseEntity<CauHinhHeThong> layCauHinh() {
        CauHinhHeThong s = cauHinhHeThongRepository.findAll().stream().findFirst().orElseGet(() -> {
            CauHinhHeThong df = new CauHinhHeThong();
            df.setTenCuaHang("ĐẠI LÝ HEO SỮA & HEO QUAY CAO CẤP");
            df.setKhauHieu("Chuyên Heo Quay - Heo Tươi Nóng - Hàng Cấp Đông");
            df.setSoDienThoai("0988.888.999");
            df.setDiaChi("TP. Hồ Chí Minh");
            df.setDonViTienTe("VNĐ");
            return cauHinhHeThongRepository.save(df);
        });
        return ResponseEntity.ok(s);
    }

    @PutMapping
    public ResponseEntity<ApiResponse<CauHinhHeThong>> capNhatCauHinh(@RequestBody CauHinhHeThong ch) {
        CauHinhHeThong s = cauHinhHeThongRepository.findAll().stream().findFirst().orElse(new CauHinhHeThong());
        if (ch.getTenCuaHang() != null) s.setTenCuaHang(ch.getTenCuaHang());
        if (ch.getKhauHieu() != null) s.setKhauHieu(ch.getKhauHieu());
        if (ch.getSoDienThoai() != null) s.setSoDienThoai(ch.getSoDienThoai());
        if (ch.getDiaChi() != null) s.setDiaChi(ch.getDiaChi());
        CauHinhHeThong daLuu = cauHinhHeThongRepository.save(s);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật cài đặt thành công!", daLuu));
    }
}
