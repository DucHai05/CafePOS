package com.example.demo.repository;

import com.example.demo.entity.LOAISANPHAM;
import com.example.demo.service.LoaiSanPhamService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoaiSanPhamRepository extends JpaRepository<LOAISANPHAM, Integer> {

}
