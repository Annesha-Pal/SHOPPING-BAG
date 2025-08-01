
package com.example.shop_service.controller;

import com.example.shop_service.model.Product;
import com.example.shop_service.repository.productRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")

public class ProductController {

    @Autowired
    private productRepository productRepository;

    // 🔹 Create Product
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // 🔹 Get All Products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 🔹 Get Product by ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        return product.orElse(null);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateQuantity(@PathVariable Long id, @RequestBody Map<String, Integer> updates) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (!optionalProduct.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Product product = optionalProduct.get();
        Integer newQuantity = updates.get("quantity");

        if (newQuantity == null) {
            return ResponseEntity.badRequest().body("Quantity is missing.");
        }

        System.out.println("📦 PATCH: Updating quantity for product ID " + id + " to " + newQuantity);
        product.setQuantity(newQuantity);
        product.setUpdateDate(LocalDateTime.now());
        productRepository.save(product);

        return ResponseEntity.ok(product);
    }

    // 🔹 Update Product
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setProductTitle(updatedProduct.getProductTitle());
            product.setProductName(updatedProduct.getProductName());
            product.setProductCategory(updatedProduct.getProductCategory());
            product.setBrand(updatedProduct.getBrand());
            product.setQuantity(updatedProduct.getQuantity());
            product.setCreateDate(updatedProduct.getCreateDate());
            product.setUpdateDate(updatedProduct.getUpdateDate());
            product.setPrice(updatedProduct.getPrice());
            product.setImageUrl((updatedProduct.getImageUrl()));
            // add other Product fields to update as needed
            return productRepository.save(product);
        }).orElse(null);
    }

    // 🔹 Delete Product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return "Product deleted successfully.";
        } else {
            return "Product not found.";
        }
    }
}
