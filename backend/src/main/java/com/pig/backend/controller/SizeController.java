package com.pig.backend.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pig.backend.domain.SizeConfig;
import com.pig.backend.dto.ApiResponse;
import com.pig.backend.repository.SizeConfigRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping({"/api/sizes", "/api/v1/sizes"})
@CrossOrigin(origins = "*")
public class SizeController {

    private final SizeConfigRepository sizeConfigRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SizeController(SizeConfigRepository sizeConfigRepository) {
        this.sizeConfigRepository = sizeConfigRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> layDanhSachSize() {
        List<SizeConfig> list = sizeConfigRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (SizeConfig sc : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", sc.getId());
            map.put("name", sc.getName());
            map.put("description", sc.getDescription());
            map.put("saleType", sc.getSaleType());
            map.put("pricePerUnit", sc.getPricePerUnit());
            map.put("weightKg", sc.getWeightKg());
            map.put("pricePerKg", sc.getPricePerKg());
            if (sc.getRangeTiersJson() != null && !sc.getRangeTiersJson().isEmpty()) {
                try {
                    List<Map<String, Object>> tiers = objectMapper.readValue(sc.getRangeTiersJson(), new TypeReference<>() {});
                    map.put("rangeTiers", tiers);
                } catch (Exception e) {
                    map.put("rangeTiers", Collections.emptyList());
                }
            } else {
                map.put("rangeTiers", Collections.emptyList());
            }
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> taoSize(@RequestBody Map<String, Object> req) {
        SizeConfig sc = new SizeConfig();
        sc.setName((String) req.getOrDefault("name", "Size Heo"));
        sc.setDescription((String) req.get("description"));
        sc.setSaleType((String) req.getOrDefault("saleType", "per_unit"));
        if (req.get("pricePerUnit") != null) {
            sc.setPricePerUnit(new BigDecimal(req.get("pricePerUnit").toString()));
        }
        if (req.get("weightKg") != null && !req.get("weightKg").toString().isEmpty()) {
            sc.setWeightKg(new BigDecimal(req.get("weightKg").toString()));
        }
        if (req.get("pricePerKg") != null) {
            sc.setPricePerKg(new BigDecimal(req.get("pricePerKg").toString()));
        }
        if (req.get("rangeTiers") != null) {
            try {
                sc.setRangeTiersJson(objectMapper.writeValueAsString(req.get("rangeTiers")));
            } catch (Exception e) {
                sc.setRangeTiersJson("[]");
            }
        }
        SizeConfig saved = sizeConfigRepository.save(sc);
        return ResponseEntity.ok(ApiResponse.ok("Lưu size thành công!", req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> capNhatSize(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        SizeConfig sc = sizeConfigRepository.findById(id).orElse(new SizeConfig());
        if (req.containsKey("name")) sc.setName((String) req.get("name"));
        if (req.containsKey("description")) sc.setDescription((String) req.get("description"));
        if (req.containsKey("saleType")) sc.setSaleType((String) req.get("saleType"));
        if (req.get("pricePerUnit") != null) {
            sc.setPricePerUnit(new BigDecimal(req.get("pricePerUnit").toString()));
        }
        if (req.get("weightKg") != null && !req.get("weightKg").toString().isEmpty()) {
            sc.setWeightKg(new BigDecimal(req.get("weightKg").toString()));
        }
        if (req.get("pricePerKg") != null) {
            sc.setPricePerKg(new BigDecimal(req.get("pricePerKg").toString()));
        }
        if (req.get("rangeTiers") != null) {
            try {
                sc.setRangeTiersJson(objectMapper.writeValueAsString(req.get("rangeTiers")));
            } catch (Exception e) {
                sc.setRangeTiersJson("[]");
            }
        }
        sizeConfigRepository.save(sc);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật size thành công!", req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> xoaSize(@PathVariable Long id) {
        sizeConfigRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xoá size thành công!", null));
    }
}
