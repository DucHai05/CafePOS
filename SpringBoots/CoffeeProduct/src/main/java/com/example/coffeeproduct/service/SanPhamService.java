package com.example.coffeeproduct.service;

import com.example.coffeeproduct.entity.SanPham;
import com.example.coffeeproduct.repository.SanPhamRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SanPhamService {

    private final SanPhamRepository sanPhamRepository;
    public SanPhamService(SanPhamRepository sanPhamRepository){ this.sanPhamRepository = sanPhamRepository; }
    public List<SanPham> getAllProduct (){
           return sanPhamRepository.findAll();
    }
}
