package com.example.coffeeproduct.controller;

import com.example.coffeeproduct.entity.SanPham;
import com.example.coffeeproduct.repository.SanPhamRepository;
import com.example.coffeeproduct.service.SanPhamService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
@RestController
public class SanPhamController {


    private final SanPhamService sanPhamService;
    public SanPhamController (SanPhamService sanPhamService){
        this.sanPhamService = sanPhamService;
    }

    @GetMapping("/getAll")
    public List<SanPham> getProduct(){
        return sanPhamService.getAllProduct();
    }
}
