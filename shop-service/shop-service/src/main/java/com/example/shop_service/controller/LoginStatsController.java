
package com.example.shop_service.controller;

import com.example.shop_service.model.User;
import com.example.shop_service.dto.LoginStatsResponse;
import com.example.shop_service.model.LoginLog;

import com.example.shop_service.model.LoginRequest;
import com.example.shop_service.repository.userRepository;
import com.example.shop_service.repository.LoginLogRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
// @CrossOrigin(origins = "*") // if Angular is on localhost:4200
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class LoginStatsController {

    @Autowired
    private userRepository userRepository;

    @Autowired
    private LoginLogRepository loginLogRepository;

    @PostMapping("/loginstats")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest login) {
        User user = userRepository.findByEmail(login.getEmail());

        if (user != null && user.getPassword().equals(login.getPassword())) {

            // ✅ Log the login event
            LoginLog log = new LoginLog();
            log.setEmail(user.getEmail());
            log.setFirstName(user.getFirstName());
            log.setRole(user.getUserRole());
            log.setLoginTime(LocalDateTime.now());
            loginLogRepository.save(log);

            // ✅ Return user details to frontend
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("firstName", user.getFirstName());

            response.put("userRole", user.getUserRole());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
    }

    @GetMapping("/loginstats") // ✅ this is what Angular calls
    public LoginStatsResponse getLoginStats() {
        List<Object[]> statsList = loginLogRepository.fetchLoginStats();
        LoginStatsResponse response = new LoginStatsResponse();

        for (Object[] row : statsList) {
            String day = (String) row[0];
            String role = (String) row[1];
            int count = ((Number) row[2]).intValue();
            response.add(day, role, count);
        }

        return response;
    }
}
