package com.example.servicetable.service;

import com.example.servicetable.dto.BanDTO;
import com.example.servicetable.entity.Ban;
import com.example.servicetable.entity.KhuVuc;
import com.example.servicetable.repository.BanRepository;
import com.example.servicetable.repository.KhuVucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BanService {
    @Autowired
    private BanRepository banRepository;
    @Autowired
    private KhuVucRepository khuVucRepository;

    public Ban getById(String maBan) {
        return banRepository.findById(maBan)
                .orElseThrow(() -> new RuntimeException("Khong tim thay ban voi ma: " + maBan));
    }

    public List<Ban> getByKhuVuc(String maKhuVuc) {
        return banRepository.findByKhuVucMaKhuVuc(maKhuVuc);
    }
    public List<Ban> getAll() { return banRepository.findByTrangThaiBanContaining("Hoạt động"); }
    public List<Ban> getTable(String maBan) { return banRepository.findTrangThaiThanhToanContainingByMaBan(maBan); }


    // HÀM THÊM MỚI: Chặn ghi đè nếu trùng mã bàn
    public Ban create(BanDTO dto) {
        // 1. Kiểm tra trùng mã bàn (Primary Key)
        if (banRepository.existsById(dto.getMaBan())) {
            throw new RuntimeException("Mã bàn này đã tồn tại, không thể thêm mới!");
        }

        // 2. Kiểm tra xem khu vực có tồn tại không
        KhuVuc khuVuc = khuVucRepository.findById(dto.getMaKhuVuc())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khu Vực!"));

        Ban ban = new Ban();
        ban.setMaBan(dto.getMaBan());
        ban.setTenBan(dto.getTenBan());
        ban.setTrangThaiBan(dto.getTrangThaiBan());
        ban.setKhuVuc(khuVuc);

        return banRepository.save(ban);
    }

    // HÀM CẬP NHẬT: Cho phép ghi đè dữ liệu cũ
    public Ban update(String id, BanDTO dto) {
        KhuVuc khuVuc = khuVucRepository.findById(dto.getMaKhuVuc())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khu Vực!"));

        Ban ban = banRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Bàn để cập nhật!"));

        ban.setTenBan(dto.getTenBan());
        ban.setTrangThaiBan(dto.getTrangThaiBan());
        ban.setKhuVuc(khuVuc);

        return banRepository.save(ban);
    }

    public void delete(String id) { banRepository.deleteById(id); }

    public void updateTrangThaiBan(String maBan, String status) {
        // Kiểm tra xem bàn có tồn tại không trước khi update
        Ban ban = banRepository.findById(maBan)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn: " + maBan));

        banRepository.updateTrangThaiThanhToan(maBan, status);
    }

}
