package com.example.shop_service.repository;

import com.example.shop_service.model.Order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface orderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}