package com.example.backend.dto;

public class PhoneOtpRequest {
    private String phoneNumber;

    public PhoneOtpRequest() {
    }

    public PhoneOtpRequest(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
