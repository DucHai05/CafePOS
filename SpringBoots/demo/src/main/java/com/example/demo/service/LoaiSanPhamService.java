package com.example.demo.service;

import com.example.demo.dto.LoaiSanPhamDTO;
import com.example.demo.entity.LOAISANPHAM;
import com.example.demo.repository.LoaiSanPhamRepository;
import com.example.demo.repository.SanPhamRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.parser.Entity;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.hibernate.Hibernate.map;

@Service
public class LoaiSanPhamService {
    @Autowired
    private LoaiSanPhamRepository loaiSanPhamRepository;
    @Autowired
    private SanPhamRepository sanPhamRepository;
    @Autowired
    private ModelMapper modelMapper;


    public List<LOAISANPHAM> getAllLoaiSanPham(){
        return loaiSanPhamRepository.findAll();
    }

    public LOAISANPHAM suaLoaiSanPhamTheoID(Integer maLoai, LOAISANPHAM loaiSanPhamCapNhat){
        loaiSanPhamCapNhat.setMaLoai(maLoai);
        return loaiSanPhamRepository.save(loaiSanPhamCapNhat);
    }

    public LOAISANPHAM themLoaiSanPham(LOAISANPHAM loaiSanPhamMoi){
        return loaiSanPhamRepository.save(loaiSanPhamMoi);
    }

    public void xoaLoaiSanPham(Integer maLoai){
        loaiSanPhamRepository.deleteById(maLoai);
    }
    public List<LoaiSanPhamDTO> getLoaiSanPhamDTO(){
        List<LOAISANPHAM> danhSachLoaiSP = loaiSanPhamRepository.findAll();
        return danhSachLoaiSP.stream().map(entity -> modelMapper.map(entity, LoaiSanPhamDTO.class)).toList();
    }
    public Optional<LOAISANPHAM> timKiemLoaiSanPham(Integer maLoai){
        return loaiSanPhamRepository.findById(maLoai);
    }
}
