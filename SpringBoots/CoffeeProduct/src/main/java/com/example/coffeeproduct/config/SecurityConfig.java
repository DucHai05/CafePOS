package com.example.coffeeproduct.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF để có thể gọi API từ bên ngoài (như Postman/ReactJS)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // CHO PHÉP tất cả các API bắt đầu bằng /api/auth/ được truy cập tự do
                        .anyRequest().authenticated() // Các API khác vẫn yêu cầu phải đăng nhập
                );

        return http.build();
    }
}