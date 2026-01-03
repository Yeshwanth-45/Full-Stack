package com.example.backend.dto;

public class SendOtpRequest {
    private String phoneNumber;

    public SendOtpRequest() {
    }

    public SendOtpRequest(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
