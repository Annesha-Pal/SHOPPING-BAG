package com.example.shop_service.repository;

import com.example.shop_service.model.LoginLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoginLogRepository extends JpaRepository<LoginLog, Long> {
    @Query(value = "SELECT DAYNAME(login_time) AS day, role, COUNT(*) AS count " +
            "FROM login_logs " +
            "GROUP BY day, role", nativeQuery = true)

    List<Object[]> fetchLoginStats();
}
