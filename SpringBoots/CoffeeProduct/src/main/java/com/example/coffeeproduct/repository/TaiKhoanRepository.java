package com.example.coffeeproduct.repository;

import com.example.coffeeproduct.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, String> {

    Optional<TaiKhoan> findTaiKhoanByTenDangNhap(String maTaiKhoan);

    Optional<TaiKhoan> findByEmail(String email);


}
