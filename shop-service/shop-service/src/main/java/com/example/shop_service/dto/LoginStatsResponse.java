// src/main/java/com/example/demo/dto/LoginStatsResponse.java
package com.example.shop_service.dto;

import java.util.HashMap;
import java.util.Map;

public class LoginStatsResponse {

    private Map<String, Map<String, Integer>> data = new HashMap<>();

    public void add(String day, String role, int count) {
        data.computeIfAbsent(day, k -> new HashMap<>()).put(role, count);
    }

    public Map<String, Map<String, Integer>> getData() {
        return data;
    }

    public void setData(Map<String, Map<String, Integer>> data) {
        this.data = data;
    }
}
