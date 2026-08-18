package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.entity.Subscription;
import com.example.backend.entity.Wallet;
import com.example.backend.entity.WalletTransaction;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.SubscriptionRepository;
import com.example.backend.repository.WalletRepository;
import com.example.backend.repository.WalletTransactionRepository;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubscriptionController {

    private final UserService userService;
    private final SubscriptionRepository subscriptionRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    public SubscriptionController(UserService userService,
                                  SubscriptionRepository subscriptionRepository,
                                  WalletRepository walletRepository,
                                  WalletTransactionRepository walletTransactionRepository) {
        this.userService = userService;
        this.subscriptionRepository = subscriptionRepository;
        this.walletRepository = walletRepository;
        this.walletTransactionRepository = walletTransactionRepository;
    }

    private Wallet getOrCreateWallet(User user) {
        return walletRepository.findByUser(user).orElseGet(() -> {
            Wallet newWallet = new Wallet(user);
            newWallet.setBalance(100.0); // Welcome bonus of 100
            newWallet.setLoyaltyPoints(500); // 500 initial points
            return walletRepository.save(newWallet);
        });
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveSubscription(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            Optional<Subscription> subOpt = subscriptionRepository.findByUserAndStatus(user, "ACTIVE");
            
            if (subOpt.isEmpty()) {
                return ResponseEntity.ok(Collections.singletonMap("active", false));
            }

            Subscription sub = subOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("active", true);
            response.put("planType", sub.getPlanType());
            response.put("monthlyFee", sub.getMonthlyFee());
            response.put("deliveriesPerMonth", sub.getDeliveriesPerMonth());
            response.put("deliveriesUsed", sub.getDeliveriesUsed());
            response.put("discountPercentage", sub.getDiscountPercentage());
            response.put("freeDelivery", sub.getFreeDelivery());
            response.put("prioritySupport", sub.getPrioritySupport());
            response.put("startDate", sub.getStartDate());
            response.put("endDate", sub.getEndDate());
            response.put("nextBillingDate", sub.getNextBillingDate());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String planType = request.get("planType");
            if (planType == null || planType.trim().isEmpty()) {
                throw new IllegalArgumentException("Plan type is required");
            }
            planType = planType.trim().toUpperCase();

            double fee;
            int deliveries;
            double discount;
            boolean freeDelivery = true;
            boolean prioritySupport;

            if ("BASIC".equals(planType)) {
                fee = 99.0;
                deliveries = 5;
                discount = 0.0;
                prioritySupport = false;
            } else if ("PREMIUM".equals(planType)) {
                fee = 199.0;
                deliveries = 15;
                discount = 5.0;
                prioritySupport = true;
            } else if ("GOLD".equals(planType)) {
                fee = 299.0;
                deliveries = 999; // Unlimited
                discount = 10.0;
                prioritySupport = true;
            } else {
                throw new IllegalArgumentException("Invalid plan type. Must be BASIC, PREMIUM, or GOLD");
            }

            User user = userService.getUserByEmail(authentication.getName());
            Wallet wallet = getOrCreateWallet(user);

            if (wallet.getBalance() < fee) {
                throw new IllegalArgumentException("Insufficient wallet balance. Please add funds first!");
            }

            // Debit user's wallet
            Double before = wallet.getBalance();
            wallet.deductBalance(fee);
            // Award loyalty points for subscription purchase
            wallet.addLoyaltyPoints((int) (fee / 2)); 
            walletRepository.save(wallet);

            WalletTransaction txn = new WalletTransaction(
                    wallet, "DEBIT", fee, 
                    "Purchased " + planType + " Subscription Plan", 
                    "sub_" + UUID.randomUUID().toString().substring(0, 8)
            );
            txn.setBalanceBefore(before);
            txn.setBalanceAfter(wallet.getBalance());
            walletTransactionRepository.save(txn);

            // Deactivate any existing active subscription
            Optional<Subscription> oldSubOpt = subscriptionRepository.findByUserAndStatus(user, "ACTIVE");
            if (oldSubOpt.isPresent()) {
                Subscription oldSub = oldSubOpt.get();
                oldSub.setStatus("EXPIRED");
                oldSub.setCancelledAt(LocalDateTime.now());
                subscriptionRepository.save(oldSub);
            }

            // Create new subscription
            Subscription sub = new Subscription(user, planType, fee);
            sub.setDeliveriesPerMonth(deliveries);
            sub.setDiscountPercentage(discount);
            sub.setFreeDelivery(freeDelivery);
            sub.setPrioritySupport(prioritySupport);
            subscriptionRepository.save(sub);

            return ResponseEntity.ok(Map.of(
                    "message", "Subscribed successfully to " + planType + " plan!",
                    "walletBalance", wallet.getBalance(),
                    "planType", planType,
                    "endDate", sub.getEndDate()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancel(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            Optional<Subscription> subOpt = subscriptionRepository.findByUserAndStatus(user, "ACTIVE");
            
            if (subOpt.isEmpty()) {
                throw new IllegalArgumentException("No active subscription found to cancel");
            }

            Subscription sub = subOpt.get();
            sub.setStatus("CANCELLED");
            sub.setCancelledAt(LocalDateTime.now());
            subscriptionRepository.save(sub);

            return ResponseEntity.ok(Map.of("message", "Subscription cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
