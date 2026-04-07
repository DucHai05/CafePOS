package com.example.demo.controller;


import com.example.demo.dto.LoaiSanPhamDTO;
import com.example.demo.entity.LOAISANPHAM;
import com.example.demo.service.LoaiSanPhamService;
import com.example.demo.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/loai-san-pham/")
public class LoaiSanPhamController {
    @Autowired
    private LoaiSanPhamService loaiSanPhamService;


    @GetMapping
    public List<LOAISANPHAM> getAllLoaiSanPham(){
        return loaiSanPhamService.getAllLoaiSanPham();
    }
    @PutMapping("/{maLoai}")
    public LOAISANPHAM suaLoaiSanPham(@PathVariable("maLoai") Integer maLoai,@RequestBody LOAISANPHAM loaiSanPhamCapNhat){
        return loaiSanPhamService.suaLoaiSanPhamTheoID(maLoai, loaiSanPhamCapNhat);
    }
    @PostMapping
    public  LOAISANPHAM themLoaiSanPham (@RequestBody LOAISANPHAM loaiSanPhamMoi){
        return loaiSanPhamService.themLoaiSanPham(loaiSanPhamMoi);
    }
    @DeleteMapping("/{maLoai}")
    public String xoaLoaiSanPhamById(@PathVariable Integer maLoai){
        loaiSanPhamService.xoaLoaiSanPham(maLoai);
        return "Delete Complete Product With TenLoai: "+maLoai+ "!";
    }
    @GetMapping("/dto")
    public List<LoaiSanPhamDTO> getAllLoaiSanPhamWithDTO(){
        return loaiSanPhamService.getLoaiSanPhamDTO();
    }
    @GetMapping("/tim-kiem/{maLoai}")
    public Optional<LOAISANPHAM> timKiemLoaiSanPhamById(@PathVariable("maLoai") Integer maLoai){
        return loaiSanPhamService.timKiemLoaiSanPham(maLoai);
    }

}
