package com.example.servicedoanhthu.controller;

import com.example.servicedoanhthu.entity.DoanhThu;
import com.example.servicedoanhthu.service.DoanhThuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doanhthu")
@CrossOrigin(origins = "*")
public class DoanhThuController {
    @Autowired
    private DoanhThuService service;

    @GetMapping
    public List<DoanhThu> getAll() {
        return service.getAll();
    }

    @GetMapping("/{maDoanhThu}")
    public DoanhThu getById(@PathVariable String maDoanhThu) {
        return service.getById(maDoanhThu);
    }

    @GetMapping("/ca/{maCa}")
    public List<DoanhThu> getByMaCa(@PathVariable String maCa) {
        return service.getByMaCa(maCa);
    }
}
