package com.example.shop_service.controller;

import com.example.shop_service.model.User;
import com.example.shop_service.repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
// import org.springframework.ui.Model;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private userRepository userRepository;

    // 🔹 Create User
    @PostMapping
    public User createUser(@RequestBody User user) {
        user.setStatus("ACTIVE");
        user.setUserRole("USER");
        user.setUpdateDate(LocalDateTime.now());
        user.setCreateDate(LocalDateTime.now());
        return userRepository.save(user);
    }

    @GetMapping
    public List<User> getFilteredUsers(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String status) {

        boolean hasFirstName = firstName != null && !firstName.trim().isEmpty();
        boolean hasStatus = status != null && !status.trim().isEmpty();

        List<User> users;

        if (!hasFirstName && !hasStatus) {
            users = userRepository.findAll();
        } else if (hasFirstName && !hasStatus) {
            users = userRepository.findByFirstNameContainingIgnoreCase(firstName);
        } else if (!hasFirstName && hasStatus) {
            users = userRepository.findByStatusIgnoreCase(status);
        } else {
            users = userRepository.findByFirstNameContainingIgnoreCaseAndStatusIgnoreCase(firstName, status);
        }

        // 🧠 Sort by relevance if firstName is searched
        if (hasFirstName) {
            final String keyword = firstName.toLowerCase();
            users.sort((a, b) -> {
                String aName = a.getFirstName().toLowerCase();
                String bName = b.getFirstName().toLowerCase();

                // 1. Exact match first
                if (aName.equals(keyword) && !bName.equals(keyword))
                    return -1;
                if (!aName.equals(keyword) && bName.equals(keyword))
                    return 1;

                // 2. Starts with keyword
                if (aName.startsWith(keyword) && !bName.startsWith(keyword))
                    return -1;
                if (!aName.startsWith(keyword) && bName.startsWith(keyword))
                    return 1;

                // 3. Contains keyword
                int indexA = aName.indexOf(keyword);
                int indexB = bName.indexOf(keyword);
                return Integer.compare(indexA, indexB);
            });
        }

        return users;
    }

    // 🔹 Get User by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElse(null);
    }

    // 🔹 Update User
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setFirstName(updatedUser.getFirstName());
            user.setLastName(updatedUser.getLastName());
            user.setEmail(updatedUser.getEmail());
            user.setPhoneNum(updatedUser.getPhoneNum());
            user.setStatus(updatedUser.getStatus());
            user.setUpdateDate(LocalDateTime.now());
            user.setUserRole(updatedUser.getUserRole());
            return userRepository.save(user);
        }).orElse(null);
    }

    // 🔹 Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = userOpt.get();
        if (!user.getOrders().isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Cannot delete user; related orders exist.");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully.");
    }

}
