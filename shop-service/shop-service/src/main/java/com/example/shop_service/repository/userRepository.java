package com.example.shop_service.repository;

import com.example.shop_service.model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface userRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByFirstNameContainingIgnoreCase(String firstName);

    List<User> findByStatusIgnoreCase(String status);

    List<User> findByFirstNameContainingIgnoreCaseAndStatusIgnoreCase(String firstName, String status);
}
