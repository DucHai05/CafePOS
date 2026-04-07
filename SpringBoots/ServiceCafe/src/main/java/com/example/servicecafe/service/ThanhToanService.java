package com.example.servicecafe.service;

import com.example.servicecafe.dto.PaymentDTO;
import com.example.servicecafe.entity.*;
import com.example.servicecafe.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate; // Đảm bảo đã import
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ThanhToanService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private ChiTietHDRepository chiTietRepository;

    // 1. PHẢI CÓ DÒNG NÀY thì messagingTemplate mới chạy được
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void xuLyThanhToan(PaymentDTO dto) {
        // 1. Tìm hóa đơn cũ, nếu không thấy thì tạo mới luôn (né lỗi 50)
        HoaDon hd = hoaDonRepository.findById(dto.getMaHoaDon())
                .orElse(new HoaDon());

        // 2. Nếu là hóa đơn mới (ID chưa có trong DB) thì set ID và ngày vào
        if (hd.getMaHoaDon() == null) {
            hd.setMaHoaDon(dto.getMaHoaDon());
            hd.setThoiGianVao(LocalDateTime.now().minusMinutes(30)); // Giả định vào 30p trước
        }

        // 3. Cập nhật các thông tin thanh toán từ React gửi lên
        hd.setMaBan(dto.getMaBan());
        hd.setPhuongThucThanhToan(dto.getPhuongThucThanhToan());
        hd.setMaKhuyenMai(dto.getMaKhuyenMai());
        hd.setTongTien(dto.getTongTienSauKM());
        hd.setTrangThaiThanhToan("Paid"); // Chốt là đã thanh toán
        hd.setThoiGianRa(LocalDateTime.now());

        // 4. Lưu xuống SQL Server
        hoaDonRepository.save(hd);

        // 5. Bắn tín hiệu WebSocket cho Sơ đồ bàn (MapTable) tự đổi màu
        try {
            messagingTemplate.convertAndSend("/topic/tables", dto.getMaBan());
            System.out.println(">>> Đã giải phóng bàn " + dto.getMaBan() + " qua WebSocket");
        } catch (Exception e) {
            System.err.println("Lỗi WebSocket: " + e.getMessage());
        }
    }
}