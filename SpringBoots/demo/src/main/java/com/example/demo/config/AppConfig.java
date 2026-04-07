package com.example.demo.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// @Configuration báo cho Spring Boot biết đây là file cấu hình hệ thống
@Configuration
public class AppConfig {

    // @Bean sẽ tạo ra 1 "cỗ máy copy" duy nhất và ném vào kho của Spring Boot
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
