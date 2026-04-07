package com.example.coffeeproduct.dto;

public class EmailRequest {
    private String email;
    private String OTP;
    private String matKhau;

    public String getOTP() {
        return OTP;
    }

    public void setOTP(String OTP) {
        this.OTP = OTP;
    }

    public String getMatKhau() {
        return matKhau;
    }

    public void setMatKhau(String matKhau) {
        this.matKhau = matKhau;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
