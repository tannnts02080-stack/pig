package com.pig.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/system-info", "/api/v1/system-info", "/api/he-thong"})
@CrossOrigin(origins = "*")
public class HeThongController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> layThongTinHeThong() {
        Map<String, Object> info = new HashMap<>();
        info.put("appName", "Pig Meat Wholesale & Retail System");
        info.put("tenUngDung", "Hệ Thống Quản Lý Đại Lý Heo Sữa - Heo Nóng & Heo Lạnh");
        info.put("version", "2.0.0-SPRINGBOOT");
        info.put("database", "Microsoft SQL Server 2022 (Database: Pig)");
        info.put("tables", "SAN_PHAM_HEO, NHA_CUNG_CAP, KHACH_HANG, DON_HANG, CHI_TIET_DON_HANG, PHIEU_NHAP_KHO, CHI_TIET_PHIEU_NHAP, TAI_KHOAN_NGAN_HANG, DONG_TIEN_NGAN_HANG, CAU_HINH_HE_THONG");
        info.put("status", "ACTIVE - OPERATIONAL");
        info.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(info);
    }
}
