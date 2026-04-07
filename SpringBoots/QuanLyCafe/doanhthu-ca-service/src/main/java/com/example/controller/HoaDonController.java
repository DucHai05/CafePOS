package com.example.controller;

import com.example.entity.HoaDon;
import com.example.service.HoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hoadon")
@CrossOrigin(origins = "*")
public class HoaDonController {
    @Autowired
    private HoaDonService service;

    @GetMapping
    public List<HoaDon> getAll() {
        return service.getAll();
    }

    @GetMapping("/{maHoaDon}")
    public HoaDon getById(@PathVariable String maHoaDon) {
        return service.getById(maHoaDon);
    }

    @GetMapping("/ban/{maBan}")
    public List<HoaDon> getByMaBan(@PathVariable String maBan) {
        return service.getByMaBan(maBan);
    }

    @GetMapping("/ca/{maCa}")
    public List<HoaDon> getByMaCa(@PathVariable String maCa) {
        return service.getByMaCa(maCa);
    }
}
