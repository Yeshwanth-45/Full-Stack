package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.entity.Wallet;
import com.example.backend.entity.WalletTransaction;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WalletRepository;
import com.example.backend.repository.WalletTransactionRepository;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "http://localhost:3000")
public class WalletController {

    private final UserService userService;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    public WalletController(UserService userService, 
                            WalletRepository walletRepository, 
                            WalletTransactionRepository walletTransactionRepository) {
        this.userService = userService;
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

    @GetMapping
    public ResponseEntity<?> getWallet(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            Wallet wallet = getOrCreateWallet(user);
            List<WalletTransaction> transactions = walletTransactionRepository.findByWalletOrderByCreatedAtDesc(wallet);
            
            Map<String, Object> response = new HashMap<>();
            response.put("balance", wallet.getBalance());
            response.put("loyaltyPoints", wallet.getLoyaltyPoints());
            response.put("totalAdded", wallet.getTotalAdded());
            response.put("totalSpent", wallet.getTotalSpent());
            
            List<Map<String, Object>> txnList = new ArrayList<>();
            for (WalletTransaction txn : transactions) {
                Map<String, Object> t = new HashMap<>();
                t.put("id", txn.getId());
                t.put("type", txn.getType());
                t.put("amount", txn.getAmount());
                t.put("description", txn.getDescription());
                t.put("referenceId", txn.getReferenceId());
                t.put("createdAt", txn.getCreatedAt());
                t.put("balanceBefore", txn.getBalanceBefore());
                t.put("balanceAfter", txn.getBalanceAfter());
                txnList.add(t);
            }
            response.put("transactions", txnList);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> err = new HashMap<>();
            err.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFunds(@RequestBody Map<String, Double> request, Authentication authentication) {
        try {
            Double amount = request.get("amount");
            if (amount == null || amount <= 0) {
                throw new IllegalArgumentException("Amount must be greater than zero");
            }
            User user = userService.getUserByEmail(authentication.getName());
            Wallet wallet = getOrCreateWallet(user);

            Double before = wallet.getBalance();
            wallet.addBalance(amount);
            // Give loyalty points for adding money: 1 point per 10 rupees
            int pointsEarned = (int) (amount / 10);
            wallet.addLoyaltyPoints(pointsEarned);
            walletRepository.save(wallet);

            WalletTransaction txn = new WalletTransaction(wallet, "CREDIT", amount, "Added funds to wallet", "dep_" + UUID.randomUUID().toString().substring(0, 8));
            txn.setBalanceBefore(before);
            txn.setBalanceAfter(wallet.getBalance());
            walletTransactionRepository.save(txn);

            return ResponseEntity.ok(Map.of("message", "Funds added successfully", "balance", wallet.getBalance(), "loyaltyPoints", wallet.getLoyaltyPoints()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/redeem-points")
    public ResponseEntity<?> redeemPoints(@RequestBody Map<String, Integer> request, Authentication authentication) {
        try {
            Integer points = request.get("points");
            if (points == null || points <= 0) {
                throw new IllegalArgumentException("Points to redeem must be greater than zero");
            }
            User user = userService.getUserByEmail(authentication.getName());
            Wallet wallet = getOrCreateWallet(user);

            if (wallet.getLoyaltyPoints() < points) {
                throw new IllegalArgumentException("Insufficient loyalty points");
            }

            Double rewardAmount = points / 10.0; // 10 points = 1 Rupee
            Double before = wallet.getBalance();
            wallet.redeemLoyaltyPoints(points);
            wallet.addBalance(rewardAmount);
            walletRepository.save(wallet);

            WalletTransaction txn = new WalletTransaction(wallet, "CREDIT", rewardAmount, "Redeemed loyalty points", "pts_" + UUID.randomUUID().toString().substring(0, 8));
            txn.setBalanceBefore(before);
            txn.setBalanceAfter(wallet.getBalance());
            walletTransactionRepository.save(txn);

            return ResponseEntity.ok(Map.of("message", "Redeemed " + points + " points for ₹" + rewardAmount, "balance", wallet.getBalance(), "loyaltyPoints", wallet.getLoyaltyPoints()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
