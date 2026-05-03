package com.example.backend.controller;

import com.example.backend.entity.PromoCode;
import com.example.backend.repository.PromoCodeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/promo")
@CrossOrigin(origins = "http://localhost:3000")
public class PromoCodeController {

    private final PromoCodeRepository promoCodeRepository;

    public PromoCodeController(PromoCodeRepository promoCodeRepository) {
        this.promoCodeRepository = promoCodeRepository;
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validatePromoCode(@RequestBody Map<String, Object> request) {
        try {
            String code = (String) request.get("code");
            Double orderAmount = Double.valueOf(request.get("orderAmount").toString());

            PromoCode promo = promoCodeRepository.findByCodeAndIsActiveTrue(code)
                    .orElseThrow(() -> new RuntimeException("Invalid promo code"));

            // Check validity period
            LocalDateTime now = LocalDateTime.now();
            if (promo.getValidFrom() != null && now.isBefore(promo.getValidFrom())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Promo code not yet valid"));
            }
            if (promo.getValidUntil() != null && now.isAfter(promo.getValidUntil())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Promo code expired"));
            }

            // Check usage limit
            if (promo.getUsageLimit() != null && promo.getUsageCount() >= promo.getUsageLimit()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Promo code usage limit reached"));
            }

            // Check minimum order amount
            if (promo.getMinOrderAmount() != null && orderAmount < promo.getMinOrderAmount()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "message", "Minimum order amount ₹" + promo.getMinOrderAmount() + " required"
                ));
            }

            // Calculate discount
            double discount = 0;
            if ("PERCENTAGE".equals(promo.getDiscountType())) {
                discount = (orderAmount * promo.getDiscountValue()) / 100;
                if (promo.getMaxDiscountAmount() != null && discount > promo.getMaxDiscountAmount()) {
                    discount = promo.getMaxDiscountAmount();
                }
            } else if ("FIXED".equals(promo.getDiscountType())) {
                discount = promo.getDiscountValue();
            }

            return ResponseEntity.ok(Map.of(
                "valid", true,
                "discount", discount,
                "description", promo.getDescription(),
                "promoCode", promo
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyPromoCode(@RequestBody Map<String, String> request) {
        try {
            String code = request.get("code");
            PromoCode promo = promoCodeRepository.findByCodeAndIsActiveTrue(code)
                    .orElseThrow(() -> new RuntimeException("Invalid promo code"));

            promo.setUsageCount(promo.getUsageCount() + 1);
            promoCodeRepository.save(promo);

            return ResponseEntity.ok(Map.of("message", "Promo code applied"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
