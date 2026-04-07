package com.example.controller;

import com.example.dto.BanDTO;
import com.example.entity.Ban;
import com.example.service.BanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ban")
@CrossOrigin(origins = "*")
public class BanController {
    @Autowired
    private BanService service;

    @GetMapping
    public List<Ban> getAll() {
        return service.getAll();
    }

    @GetMapping("/{maBan}")
    public Ban getById(@PathVariable String maBan) {
        return service.getById(maBan);
    }

    @GetMapping("/khuvuc/{maKhuVuc}")
    public List<Ban> getByKhuVuc(@PathVariable String maKhuVuc) {
        return service.getByKhuVuc(maKhuVuc);
    }

    @PostMapping
    public Ban create(@RequestBody BanDTO banDTO) {
        // Gọi hàm create (có check trùng)
        return service.create(banDTO);
    }

    @PutMapping("/{id}")
    public Ban update(@PathVariable String id, @RequestBody BanDTO banDTO) {
        // Gọi hàm update (ghi đè dựa trên ID)
        return service.update(id, banDTO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}
