package com.example.shop_service.services;

import com.example.shop_service.repository.userRepository;
import com.example.shop_service.repository.productRepository;
import com.example.shop_service.dto.AdminDto;
import com.example.shop_service.repository.orderRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private final userRepository userRepository;
    private final productRepository productRepository;
    private final orderRepository orderRepository;

    public AdminService(userRepository userRepository, productRepository productRepository,
            orderRepository orderRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public AdminDto getSummary() {
        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        return new AdminDto(totalUsers, totalProducts, totalOrders);
    }
}
