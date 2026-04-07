package com.example.demo.service;


import com.example.demo.dto.SanPhamDTO;
import com.example.demo.entity.SANPHAM;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.SanPhamRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import java.util.ArrayList;
import java.util.List;

@Service
public class SanPhamService {
    @Autowired
    private SanPhamRepository sanPhamRepository;
    public List<SANPHAM> layDanhSachSanPham(){
        return sanPhamRepository.findAll();
    }
    public SANPHAM themSanPham(SANPHAM sanPhamMoi){
        return sanPhamRepository.save(sanPhamMoi);
    }
    public void xoaSanPham(Integer maSP) {
        if (!sanPhamRepository.existsById(maSP)) {
            throw new ResourceNotFoundException("Not found product with ID: " + maSP);
        }
        sanPhamRepository.deleteById(maSP);

    }
    public SANPHAM suaSanPham (Integer maSP, SANPHAM sanPhamCapNhat){
        sanPhamCapNhat.setMaSP(maSP);
        return sanPhamRepository.save(sanPhamCapNhat);
    }
    public List<SANPHAM> timKiemTheoTen(String tukhoa){
        return sanPhamRepository.findByTenSPContaining(tukhoa);
    }
    public List<SANPHAM> timKiemSanPhamGiaLonHon(Double gia){
        return sanPhamRepository.findByDonGiaGreaterThan(gia);
    }
    public List<SANPHAM> timKiemTheoTrangThai(Integer trangThai){
        return sanPhamRepository.findByTrangThai(trangThai);
    }
    public List<SANPHAM> timKiemTheoTenSPandTrangThai(String tenSP, Integer trangThai){
        return sanPhamRepository.findByTenSPContainingAndTrangThai(tenSP, trangThai);
    }

    public List<SanPhamDTO> layDanhSachSPDTO(){
        List<SANPHAM> danhSachEntity = sanPhamRepository.findAll();
        List<SanPhamDTO> danhSachDTO = new ArrayList<>();

        for(SANPHAM entity : danhSachEntity){
            SanPhamDTO dto = new SanPhamDTO();
            dto.setDonGia(entity.getDonGia());
            dto.setMaSP(entity.getMaSP());
            dto.setTenSP(entity.getTenSP());

            if(entity.getMaLoai() != null){
                dto.setTenLoai(entity.getMaLoai().getTenLoai());
            }
            danhSachDTO.add(dto);
        }
        return danhSachDTO;
    }

    @Autowired
    private ModelMapper modelMapper;
    public List<SanPhamDTO> layDanhSachDTONganGon(){
        List<SANPHAM> danhSachEntity = sanPhamRepository.findAll();

                return danhSachEntity.stream().map(entity -> modelMapper.map(entity, SanPhamDTO.class)).toList();
    }

    public Page<SanPhamDTO> layDanhSachPhanTrang(int page, int size, String sortField, String sortDir) {
        // 1. Tạo đối tượng Sắp xếp (Tăng dần hoặc Giảm dần)
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortField).ascending()
                : Sort.by(sortField).descending();

        // 2. Tạo đối tượng Phân trang (Trang số mấy, kích thước bao nhiêu, sắp xếp thế nào)
        Pageable pageable = PageRequest.of(page, size, sort);

        // 3. Gọi repository (Spring JPA tự hiểu và phân trang luôn)
        Page<SANPHAM> pageEntity = sanPhamRepository.findAll(pageable);

        // 4. Biến đổi Page<Entity> thành Page<DTO> bằng ModelMapper (Vẫn dùng .map cực gọn)
        return pageEntity.map(entity -> modelMapper.map(entity, SanPhamDTO.class));
    }
    public Page<SanPhamDTO> timKiemPhanTrang(String ten, int page, int size){
        Pageable pageable = PageRequest.of(page, size);
        Page<SANPHAM> pageEntity = sanPhamRepository.findByTenSPContaining(ten, pageable);
        return pageEntity.map(entity -> modelMapper.map(entity, SanPhamDTO.class));
    }

}
