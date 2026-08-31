package com.pig.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "SIZE_CONFIG")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SizeConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", columnDefinition = "NVARCHAR(255)", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "sale_type", length = 50, nullable = false)
    private String saleType = "per_unit"; // per_unit, per_range, per_kg

    @Column(name = "price_per_unit", precision = 18, scale = 2)
    private BigDecimal pricePerUnit = BigDecimal.ZERO;

    @Column(name = "weight_kg", precision = 10, scale = 2)
    private BigDecimal weightKg;

    @Column(name = "price_per_kg", precision = 18, scale = 2)
    private BigDecimal pricePerKg = BigDecimal.ZERO;

    @Column(name = "range_tiers_json", columnDefinition = "NVARCHAR(MAX)")
    private String rangeTiersJson;

    public SizeConfig() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSaleType() { return saleType; }
    public void setSaleType(String saleType) { this.saleType = saleType; }

    public BigDecimal getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(BigDecimal pricePerUnit) { this.pricePerUnit = pricePerUnit; }

    public BigDecimal getWeightKg() { return weightKg; }
    public void setWeightKg(BigDecimal weightKg) { this.weightKg = weightKg; }

    public BigDecimal getPricePerKg() { return pricePerKg; }
    public void setPricePerKg(BigDecimal pricePerKg) { this.pricePerKg = pricePerKg; }

    public String getRangeTiersJson() { return rangeTiersJson; }
    public void setRangeTiersJson(String rangeTiersJson) { this.rangeTiersJson = rangeTiersJson; }
}
