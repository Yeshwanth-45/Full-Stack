package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final int OTP_LENGTH = 6;
    private static final long OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String sendOtp(String phoneNumber) {
        // Validate phone number
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new RuntimeException("Phone number is required");
        }
        
        // Remove any non-digit characters and validate length
        String cleanPhone = phoneNumber.replaceAll("\\D", "");
        if (cleanPhone.length() != 10) {
            throw new RuntimeException("Phone number must be 10 digits");
        }

        // Generate 6-digit OTP
        String otp = generateOtp();
        long otpExpiry = System.currentTimeMillis() + OTP_EXPIRY_TIME;

        // Find existing user or create new one
        User user = userRepository.findByPhoneNumber(cleanPhone)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setPhoneNumber(cleanPhone);
                    return newUser;
                });

        // Set OTP and expiry
        user.setOtp(otp);
        user.setOtpExpiry(otpExpiry);
        user.setOtpVerified(false);
        userRepository.save(user);

        // In development, log the OTP to console
        // In production, send SMS via Twilio/AWS SNS
        System.out.println("[Backend] OTP for " + cleanPhone + ": " + otp);

        return "OTP sent successfully";
    }

    public String verifyOtp(String phoneNumber, String otp) {
        // Validate input
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new RuntimeException("Phone number is required");
        }
        if (otp == null || otp.trim().isEmpty()) {
            throw new RuntimeException("OTP is required");
        }

        String cleanPhone = phoneNumber.replaceAll("\\D", "");
        
        // Find user by phone number
        User user = userRepository.findByPhoneNumber(cleanPhone)
                .orElseThrow(() -> new RuntimeException("Phone number not found. Please request OTP first."));

        // Check if OTP exists
        if (user.getOtp() == null) {
            throw new RuntimeException("No OTP found. Please request OTP first.");
        }

        // Check if OTP has expired
        if (System.currentTimeMillis() > user.getOtpExpiry()) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        // Check if OTP matches
        if (!otp.equals(user.getOtp())) {
            throw new RuntimeException("Invalid OTP. Please try again.");
        }

        // Mark OTP as verified and clear it
        user.setOtpVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        // Generate and return JWT token
        return JwtUtil.generateToken(user.getPhoneNumber());
    }

    private String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    public String register(String email, String password, String name) {
        // Validate input
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }

        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User(email, passwordEncoder.encode(password), name);
        userRepository.save(user);

        // Generate and return JWT token
        return JwtUtil.generateToken(user.getEmail());
    }

    public String login(String email, String password) {
        // Validate input
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found or invalid credentials"));

        // Check if password matches
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate and return JWT token
        return JwtUtil.generateToken(user.getEmail());
    }

    public String googleLogin(String email, String name) {
        // Find existing user or create new one
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User(email, name);
                    return userRepository.save(newUser);
                });

        // Generate and return JWT token
        return JwtUtil.generateToken(user.getEmail());
    }
}
