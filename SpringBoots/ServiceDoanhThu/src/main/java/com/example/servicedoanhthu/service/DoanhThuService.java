package com.example.servicedoanhthu.service;

import com.example.servicedoanhthu.entity.DoanhThu;
import com.example.servicedoanhthu.repository.DoanhThuRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoanhThuService {
    @Autowired
    private DoanhThuRepository doanhThuRepository;

    public List<DoanhThu> getAll() {
        return doanhThuRepository.findAll();
    }

    public DoanhThu getById(String maDoanhThu) {
        return doanhThuRepository.findById(maDoanhThu)
                .orElseThrow(() -> new RuntimeException("Khong tim thay doanh thu voi ma: " + maDoanhThu));
    }

    public DoanhThu getByMaCa(String maCa) {
        return doanhThuRepository.findByMaCa(maCa)
                .orElseThrow(() -> new RuntimeException("Khong tim thay doanh thu cho ca: " + maCa));
    }

    @Transactional
    public DoanhThu updateRevenueAfterPayment(String maCa, Double amount, String method) {
        // 1. Tìm bản ghi doanh thu theo mã ca
        DoanhThu doanhThu = doanhThuRepository.findByMaCa(maCa)
                .orElseGet(() -> {
                    DoanhThu newDt = new DoanhThu();

                    // Gán ID theo định dạng DT + Mã ca (Ví dụ: DT-CA001) để không bao giờ trùng
                    // Nếu chưa có bản ghi (ví dụ ca mới mở), ta tạo mới luôn
                    newDt.setMaCa(maCa);
                    newDt.setTienMat(0.0);
                    newDt.setTienCK(0.0);
                    newDt.setTienThu(0.0);
                    newDt.setTienChi(0.0);
                    return newDt;
                });

        // 🛠️ BỔ SUNG LOGIC CỘNG TIỀN:
        if ("CASH".equalsIgnoreCase(method) || "Tiền mặt".equalsIgnoreCase(method)) {
            Double currentMat = doanhThu.getTienMat() != null ? doanhThu.getTienMat() : 0.0;
            doanhThu.setTienMat(currentMat + amount);
        } else if ("TRANSFER".equalsIgnoreCase(method) || "Chuyển khoản".equalsIgnoreCase(method)) {
            Double currentCK = doanhThu.getTienCK() != null ? doanhThu.getTienCK() : 0.0;
            doanhThu.setTienCK(currentCK + amount);
        }
        // 4. Lưu lại
        return doanhThuRepository.save(doanhThu);
    }
}
