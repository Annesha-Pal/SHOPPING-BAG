package com.example.shop_service.repository;

import com.example.shop_service.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface productRepository extends JpaRepository<Product, Long> {
}
// You can add custom query methods if needed
