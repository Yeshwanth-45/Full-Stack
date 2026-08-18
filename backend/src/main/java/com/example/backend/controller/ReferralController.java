package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.entity.Referral;
import com.example.backend.entity.Wallet;
import com.example.backend.entity.WalletTransaction;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.ReferralRepository;
import com.example.backend.repository.WalletRepository;
import com.example.backend.repository.WalletTransactionRepository;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/referrals")
@CrossOrigin(origins = "http://localhost:3000")
public class ReferralController {

    private final UserService userService;
    private final ReferralRepository referralRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;

    public ReferralController(UserService userService,
                              ReferralRepository referralRepository,
                              WalletRepository walletRepository,
                              WalletTransactionRepository walletTransactionRepository) {
        this.userService = userService;
        this.referralRepository = referralRepository;
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

    private String generateUniqueReferralCode(User user) {
        String cleanName = user.getName().toUpperCase().replaceAll("[^A-Z0-9]", "");
        if (cleanName.length() > 5) {
            cleanName = cleanName.substring(0, 5);
        }
        return "BITE-" + cleanName + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    @GetMapping
    public ResponseEntity<?> getReferrals(Authentication authentication) {
        try {
            User user = userService.getUserByEmail(authentication.getName());
            
            // Find shareable code or create one
            List<Referral> myInvites = referralRepository.findByReferrerOrderByCreatedAtDesc(user);
            String shareableCode = null;
            for (Referral ref : myInvites) {
                if (ref.getReferred() == null) {
                    shareableCode = ref.getReferralCode();
                    break;
                }
            }

            if (shareableCode == null) {
                shareableCode = generateUniqueReferralCode(user);
                Referral shareable = new Referral(user, shareableCode);
                shareable.setReferred(null);
                shareable.setStatus("PENDING");
                referralRepository.save(shareable);
            }

            // List of completed referrals
            List<Map<String, Object>> completedReferrals = new ArrayList<>();
            for (Referral ref : myInvites) {
                if (ref.getReferred() != null && "COMPLETED".equals(ref.getStatus())) {
                    Map<String, Object> r = new HashMap<>();
                    r.put("id", ref.getId());
                    r.put("referredName", ref.getReferred().getName());
                    r.put("referredEmail", ref.getReferred().getEmail());
                    r.put("reward", ref.getReferrerReward());
                    r.put("points", ref.getReferrerPoints());
                    r.put("completedAt", ref.getCompletedAt());
                    completedReferrals.add(r);
                }
            }

            // Check if user themselves was referred by someone
            Optional<Referral> appliedReferral = referralRepository.findByReferred(user);
            String referredBy = appliedReferral.map(ref -> ref.getReferrer().getName()).orElse(null);

            Map<String, Object> response = new HashMap<>();
            response.put("referralCode", shareableCode);
            response.put("history", completedReferrals);
            response.put("referredBy", referredBy);
            response.put("totalEarned", completedReferrals.stream().mapToDouble(r -> (Double) r.get("reward")).sum());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyCode(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String code = request.get("code");
            if (code == null || code.trim().isEmpty()) {
                throw new IllegalArgumentException("Referral code is required");
            }
            code = code.trim().toUpperCase();

            User currentUser = userService.getUserByEmail(authentication.getName());

            // Check if user has already been referred
            Optional<Referral> existing = referralRepository.findByReferred(currentUser);
            if (existing.isPresent()) {
                throw new IllegalArgumentException("You have already applied a referral code");
            }

            // Find the shareable code record
            Optional<Referral> shareableOpt = referralRepository.findByReferralCode(code);
            if (shareableOpt.isEmpty()) {
                throw new IllegalArgumentException("Invalid referral code");
            }

            Referral shareable = shareableOpt.get();
            User referrerUser = shareable.getReferrer();

            if (referrerUser.getId().equals(currentUser.getId())) {
                throw new IllegalArgumentException("You cannot refer yourself");
            }

            // Create completed referral record
            Referral completed = new Referral();
            completed.setReferrer(referrerUser);
            completed.setReferred(currentUser);
            completed.setReferralCode(code);
            completed.setStatus("COMPLETED");
            completed.setReferrerReward(50.0);
            completed.setReferredReward(20.0);
            completed.setReferrerPoints(100);
            completed.setReferredPoints(50);
            completed.setCompletedAt(LocalDateTime.now());
            referralRepository.save(completed);

            // Reward referrer
            Wallet referrerWallet = getOrCreateWallet(referrerUser);
            Double beforeReferrer = referrerWallet.getBalance();
            referrerWallet.addBalance(50.0);
            referrerWallet.addLoyaltyPoints(100);
            walletRepository.save(referrerWallet);

            WalletTransaction referrerTxn = new WalletTransaction(
                    referrerWallet, "CREDIT", 50.0, 
                    "Referral bonus for inviting " + currentUser.getName(), 
                    "ref_" + completed.getId()
            );
            referrerTxn.setBalanceBefore(beforeReferrer);
            referrerTxn.setBalanceAfter(referrerWallet.getBalance());
            walletTransactionRepository.save(referrerTxn);

            // Reward referred (current user)
            Wallet currentWallet = getOrCreateWallet(currentUser);
            Double beforeCurrent = currentWallet.getBalance();
            currentWallet.addBalance(20.0);
            currentWallet.addLoyaltyPoints(50);
            walletRepository.save(currentWallet);

            WalletTransaction currentTxn = new WalletTransaction(
                    currentWallet, "CREDIT", 20.0, 
                    "Referral bonus for joining via code " + code, 
                    "ref_" + completed.getId()
            );
            currentTxn.setBalanceBefore(beforeCurrent);
            currentTxn.setBalanceAfter(currentWallet.getBalance());
            walletTransactionRepository.save(currentTxn);

            return ResponseEntity.ok(Map.of(
                    "message", "Referral code applied successfully!",
                    "reward", 20.0,
                    "points", 50,
                    "referrerName", referrerUser.getName()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
