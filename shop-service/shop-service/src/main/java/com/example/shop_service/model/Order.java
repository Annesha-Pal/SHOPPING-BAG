package com.example.shop_service.model;

import javax.persistence.JoinColumn;

import javax.persistence.ManyToOne;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    // @ManyToOne
    // @JoinColumn(name = "product_id", nullable = false)
    // private Product product;

    // @ManyToMany
    // @JoinTable(name = "order_products", joinColumns = @JoinColumn(name =
    // "order_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))

    // private List<Product> products;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    // @JsonIgnoreProperties("orders")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "orders" })
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    // @JsonBackReference
    // @JsonIgnoreProperties("orders")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "orders" })
    private User user;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    public Order() {
    }

    public Order(Product product, User user, int quantity, LocalDateTime createdDate,
            LocalDateTime updatedDate) {
        this.product = product;
        this.user = user;
        this.quantity = quantity;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
        // this.totalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));
        updatedTotalPrice();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    // public void setProduct(Product product) {
    // this.product = product;
    // if (product != null) {
    // this.totalPrice =
    // product.getPrice().multiply(BigDecimal.valueOf(this.quantity));
    // }
    // }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setProduct(Product product) {
        this.product = product;
        updatedTotalPrice();
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
        updatedTotalPrice();
    }

    // private void updatedTotalPrice() {
    // if (this.product != null && this.quantity > 0) {
    // this.totalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));
    // }
    // }
    private void updatedTotalPrice() {
        if (this.product != null && this.product.getPrice() != null && this.quantity > 0) {
            this.totalPrice = product.getPrice().multiply(BigDecimal.valueOf(quantity));
        } else {
            this.totalPrice = BigDecimal.ZERO;
        }
    }
    // public void setQuantity(int quantity) {
    // this.quantity = quantity;
    // if (this.product != null) {
    // this.totalPrice =
    // this.product.getPrice().multiply(BigDecimal.valueOf(quantity));
    // }
    // }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
}
