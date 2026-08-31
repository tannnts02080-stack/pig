package com.pig.backend.controller;

import com.pig.backend.dto.BaoCaoDashboardDTO;
import com.pig.backend.dto.TongKetNhapTrongNgayDTO;
import com.pig.backend.service.BaoCaoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping({"/api/reports", "/api/v1/reports", "/api/bao-cao"})
@CrossOrigin(origins = "*")
public class BaoCaoController {

    private final BaoCaoService baoCaoService;

    public BaoCaoController(BaoCaoService baoCaoService) {
        this.baoCaoService = baoCaoService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<BaoCaoDashboardDTO> layBaoCaoDashboard(
            @RequestParam(defaultValue = "month") String filterType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year
    ) {
        return ResponseEntity.ok(baoCaoService.layBaoCaoDashboard(filterType, date, month, year));
    }

    @GetMapping("/daily-import")
    public ResponseEntity<TongKetNhapTrongNgayDTO> layTongKetNhapTrongNgay(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(baoCaoService.layTongKetNhapTrongNgay(date));
    }
}
