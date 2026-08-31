package com.pig.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
        System.out.println("\n=======================================================");
        System.out.println("🐖 PIG MANAGEMENT BACKEND (SPRING BOOT) ĐANG CHẠY 🐖");
        System.out.println("🚀 RESTful API v1: http://localhost:8080/api/v1");
        System.out.println("🗄️ Database: Microsoft SQL Server [Pig] (Hibernate DDL Auto)");
        System.out.println("=======================================================\n");
    }
}
