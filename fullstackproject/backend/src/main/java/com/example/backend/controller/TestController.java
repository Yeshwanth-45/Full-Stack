package com.example.backend.controller;

import com.example.backend.service.DataInitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Autowired
    private DataInitService dataInitService;

    @GetMapping("/api/test")
    public String test() {
        return "Backend is running successfully";
    }

    @PostMapping("/api/init-data")
    public String initializeData() {
        return dataInitService.initializeSampleData();
    }
}
