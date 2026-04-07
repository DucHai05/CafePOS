package com.example.demo.repository;

import com.example.demo.entity.SANPHAM;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SANPHAM, Integer>{
        List<SANPHAM> findByTenSPContaining(String tuKhoa);
        List<SANPHAM> findByDonGiaGreaterThan(Double gia);
        List<SANPHAM> findByTrangThai (Integer trangThai );
        List<SANPHAM> findByTenSPContainingAndTrangThai(String tenSP, Integer trangThai);
        Page<SANPHAM> findByTenSPContaining(String ten, Pageable pageable);
}
