package com.example.controller;

import com.example.entity.ChiTietHD;
import com.example.service.ChiTietHDService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chitiethd")
@CrossOrigin(origins = "*")
public class ChiTietHDController {
    @Autowired
    private ChiTietHDService service;

    @GetMapping
    public List<ChiTietHD> getAll() {
        return service.getAll();
    }

    @GetMapping("/{maChiTietHD}")
    public ChiTietHD getById(@PathVariable String maChiTietHD) {
        return service.getById(maChiTietHD);
    }

    @GetMapping("/hoadon/{maHoaDon}")
    public List<ChiTietHD> getByMaHoaDon(@PathVariable String maHoaDon) {
        return service.getByMaHoaDon(maHoaDon);
    }
}
