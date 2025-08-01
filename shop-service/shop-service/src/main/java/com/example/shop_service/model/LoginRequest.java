package com.example.shop_service.model;

// ✅ Add these imports if using Lombok or manually define getters/setters
public class LoginRequest {

    private String email;
    private String password;

    // Required no-args constructor
    public LoginRequest() {
    }

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // ✅ Add these getters
    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // ✅ And setters if needed (for deserialization)
    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
