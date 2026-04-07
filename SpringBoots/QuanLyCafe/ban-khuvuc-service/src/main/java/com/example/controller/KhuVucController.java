package com.example.controller;

import com.example.entity.KhuVuc;
import com.example.service.KhuVucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/khuvuc")
@CrossOrigin(origins = "*") // Mở CORS cho React
public class KhuVucController {
    @Autowired
    private KhuVucService service;

    @GetMapping
    public List<KhuVuc> getAll() { return service.getAll(); }

    @PostMapping
    public KhuVuc create(@RequestBody KhuVuc khuVuc) {
        // Gọi hàm createNew để nó kiểm tra trùng mã
        return service.createNew(khuVuc);
    }

    @PutMapping("/{id}")
    public KhuVuc update(@PathVariable String id, @RequestBody KhuVuc khuVuc) {
        khuVuc.setMaKhuVuc(id);
        // Gọi hàm update để ghi đè dữ liệu cũ
        return service.update(khuVuc);
    }

    // Hàm dành riêng cho thêm mới

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}