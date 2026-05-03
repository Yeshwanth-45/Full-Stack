package com.example.backend.controller;

import com.example.backend.entity.Address;
import com.example.backend.entity.User;
import com.example.backend.repository.AddressRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "http://localhost:3000")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressController(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getUserAddresses(@RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Address> addresses = addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user);
            return ResponseEntity.ok(addresses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody Address address, @RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            address.setUser(user);

            // If this is set as default, unset other defaults
            if (address.getIsDefault()) {
                addressRepository.findByUserAndIsDefaultTrue(user).ifPresent(defaultAddr -> {
                    defaultAddr.setIsDefault(false);
                    addressRepository.save(defaultAddr);
                });
            }

            Address savedAddress = addressRepository.save(address);
            return ResponseEntity.ok(Map.of("message", "Address added", "address", savedAddress));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable Long id, @RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Address address = addressRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Address not found"));

            // Unset other defaults
            addressRepository.findByUserAndIsDefaultTrue(user).ifPresent(defaultAddr -> {
                defaultAddr.setIsDefault(false);
                addressRepository.save(defaultAddr);
            });

            address.setIsDefault(true);
            addressRepository.save(address);

            return ResponseEntity.ok(Map.of("message", "Default address updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        try {
            addressRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Address deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
