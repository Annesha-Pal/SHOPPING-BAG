
package com.example.shop_service.controller;

import com.example.shop_service.model.Order;
import com.example.shop_service.repository.orderRepository;
import com.example.shop_service.repository.userRepository;
import com.example.shop_service.repository.productRepository;
import com.example.shop_service.model.Product;
import com.example.shop_service.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private orderRepository orderRepository;

    @Autowired
    private userRepository userRepository;

    @Autowired
    private productRepository productRepository;

    // 🔹 Create Order
    // @PostMapping
    // public ResponseEntity<Order> createOrder(@RequestBody Order order) {
    // if (order.getUser() == null || order.getUser().getId() == null) {
    // throw new RuntimeException("User ID is required.");
    // }

    // if (order.getProduct() == null || order.getProduct().getId() == null) {
    // throw new RuntimeException("Product ID is required.");
    // }
    // if (order.getQuantity() <= 0) {
    // throw new RuntimeException("Quantity must be greater than zero.");
    // }

    // Optional<User> userOpt = userRepository.findById(order.getUser().getId());
    // if (!userOpt.isPresent()) {
    // throw new RuntimeException("User not found with ID: " +
    // order.getUser().getId());
    // }
    // Optional<Product> productOpt =
    // productRepository.findById(order.getProduct().getId());
    // if (!productOpt.isPresent()) {
    // throw new RuntimeException("Product not found with ID: " +
    // order.getProduct().getId());
    // }

    // Product product = productOpt.get();
    // BigDecimal totalPrice =
    // product.getPrice().multiply(BigDecimal.valueOf(order.getQuantity()));

    // order.setUser(userOpt.get());
    // order.setProduct(product);
    // order.setTotalPrice(totalPrice);
    // order.setCreatedDate(LocalDateTime.now());
    // order.setUpdatedDate(LocalDateTime.now());

    // order.setTotalPrice(product.getPrice().multiply(java.math.BigDecimal.valueOf(order.getQuantity())));
    // return orderRepository.save(order);
    // return ResponseEntity.ok(savedOrder);
    // }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        if (order.getUser() == null || order.getUser().getId() == null) {
            throw new RuntimeException("User ID is required.");
        }

        if (order.getProduct() == null || order.getProduct().getId() == null) {
            throw new RuntimeException("Product ID is required.");
        }

        if (order.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than zero.");
        }

        Optional<User> userOpt = userRepository.findById(order.getUser().getId());
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with ID: " + order.getUser().getId());
        }

        Optional<Product> productOpt = productRepository.findById(order.getProduct().getId());
        if (!productOpt.isPresent()) {
            throw new RuntimeException("Product not found with ID: " + order.getProduct().getId());
        }

        Product product = productOpt.get();
        BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(order.getQuantity()));

        order.setUser(userOpt.get());
        order.setProduct(product);
        order.setTotalPrice(totalPrice);
        order.setCreatedDate(LocalDateTime.now());
        order.setUpdatedDate(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        // ✅ This prevents the 500 Internal Server Error
        return ResponseEntity.ok(savedOrder);
    }

    // 🔹 Get All Orders
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 🔹 Get Order by ID
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        return orderRepository.findByUserId(userId);
    }

    // @GetMapping("/user/{userId}/product/{productId}")
    // public ResponseEntity<Order> getOrderForUser(
    // @PathVariable Long userId,
    // @PathVariable Long productId) {

    // // Validate user exists
    // Optional<User> userOpt = userRepository.findById(userId);
    // if (!userOpt.isPresent()) {
    // return ResponseEntity.notFound().build();
    // }

    // // Find order by orderId
    // Optional<Order> orderOpt = orderRepository.findById(productId);
    // if (!orderOpt.isPresent()) {
    // return ResponseEntity.notFound().build();
    // }

    // Order order = orderOpt.get();

    // // Check if order belongs to user
    // if (!order.getUser().getId().equals(userId)) {
    // // Forbidden or not found to hide existence of order for other users
    // return ResponseEntity.status(403).build();
    // }

    // return ResponseEntity.ok(order);
    // }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order updatedOrder) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);
        if (!existingOrderOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Order existingOrder = existingOrderOpt.get();
        existingOrder.setQuantity(updatedOrder.getQuantity());
        BigDecimal newTotal = existingOrder.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(updatedOrder.getQuantity()));
        existingOrder.setTotalPrice(newTotal);
        existingOrder.setUpdatedDate(LocalDateTime.now());

        return ResponseEntity.ok(orderRepository.save(existingOrder));
    }
    // @PostMapping
    // public ResponseEntity<Order> createOrder(@RequestBody Order order) {
    // Order savedOrder = orderRepository.save(order);
    // return ResponseEntity.ok(savedOrder); // Return saved order with ID
    // }

    // 🔹 Delete Order
    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        if (orderRepository.existsById(id)) {
            orderRepository.deleteById(id);
            return "Order deleted successfully.";
        } else {
            return "Order not found.";
        }
    }

}