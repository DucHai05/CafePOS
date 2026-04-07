package com.example.demo.controller;

import com.example.demo.dto.SanPhamDTO;
import com.example.demo.entity.SANPHAM;
import com.example.demo.service.SanPhamService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/san-pham")
public class SanPhamController {
    @Autowired
    private SanPhamService sanPhamService;

    @GetMapping
    public List<SANPHAM> hienThiDanhSach(){
        return sanPhamService.layDanhSachSanPham();
    }

    @PostMapping
    public SANPHAM taoMoiSanPham(@RequestBody SANPHAM sanPham){
        return sanPhamService.themSanPham(sanPham);
    }
    @DeleteMapping("/{id}")
    public String xoaSanPhamThanhCong(@PathVariable("id") Integer maSP){
        sanPhamService.xoaSanPham(maSP);
        return "Đã xóa sản phẩm có mã số: "+maSP+" thành công!";
    }

    @PutMapping("/{id}")
    public SANPHAM suaSanPham(@PathVariable("id") Integer maSP, @RequestBody SANPHAM sanPham){
        return sanPhamService.suaSanPham(maSP, sanPham);
    }
    @GetMapping("/tim-kiem")
    public List<SANPHAM> timKiemSanPham(@RequestParam("ten") String tuKhoa){
        return sanPhamService.timKiemTheoTen(tuKhoa);

    }
    @GetMapping("/tim")
    public List<SANPHAM> timKiemGiaCaoHon(@RequestParam("gia") Double gia){
        return sanPhamService.timKiemSanPhamGiaLonHon(gia);
    }
    @GetMapping("/tim-kiem-trang-thai")
    public List<SANPHAM> timKiemByTrangThai(@RequestParam("trangThai") Integer trangThai){
        return sanPhamService.timKiemTheoTrangThai(trangThai);
    }
    @GetMapping("/tim-ten-trang-thai")
    public List<SANPHAM> timKiemTenandTrangThai(@RequestParam("ten") String tenSP, @RequestParam("trangThai") Integer trangThai){
        return sanPhamService.timKiemTheoTenSPandTrangThai(tenSP, trangThai);
    }
    @GetMapping("/dto")
    public List<SanPhamDTO> getDanhSachSanPhamDTO(){
        return sanPhamService.layDanhSachSPDTO();
    }
    @GetMapping("/dto-ngan-gon")
    public List<SanPhamDTO> getDanhSachSanPhamDTONganGon(){
        return sanPhamService.layDanhSachDTONganGon();
    }
    @PostMapping("/tao-moi-chuan")
    public String taoMoiChuan(@Valid @RequestBody SanPhamDTO data){
        return "Dữ liệu hợp lệ! Tên: "+ data.getTenLoai()+ " Giá: "+data.getDonGia();
    }


    // FindAll nhưng phân trang
    @GetMapping("/danh-sach-pro")
    public Page<SanPhamDTO> getSanPhamPhanTrang(
            @RequestParam(defaultValue = "0") int page,      // Trang mặc định là 0
            @RequestParam(defaultValue = "5") int size,      // Mỗi trang 5 món
            @RequestParam(defaultValue = "donGia") String sort, // Mặc định xếp theo giá
            @RequestParam(defaultValue = "asc") String dir   // Mặc định tăng dần
    ) {
        return sanPhamService.layDanhSachPhanTrang(page, size, sort, dir);
    }

    @GetMapping("/search")
    public Page<SanPhamDTO> search(
            @RequestParam String ten,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return sanPhamService.timKiemPhanTrang(ten, page, size);
    }

}
