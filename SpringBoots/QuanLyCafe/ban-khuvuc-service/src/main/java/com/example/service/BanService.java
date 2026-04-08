package com.example.service;

import com.example.dto.BanDTO;
import com.example.entity.Ban;
import com.example.entity.KhuVuc;
import com.example.repository.BanRepository;
import com.example.repository.KhuVucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BanService {
    private static final String MAINTENANCE_STATUS = "Bảo trì";

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

    public List<Ban> getAll() {
        return banRepository.findAll();
    }

    public Ban create(BanDTO dto) {
        if (banRepository.existsById(dto.getMaBan())) {
            throw new RuntimeException("Mã bàn này đã tồn tại, không thể thêm mới!");
        }

        KhuVuc khuVuc = khuVucRepository.findById(dto.getMaKhuVuc())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khu Vực!"));

        Ban ban = new Ban();
        ban.setMaBan(dto.getMaBan());
        ban.setTenBan(dto.getTenBan());
        ban.setTrangThaiBan(dto.getTrangThaiBan());
        ban.setKhuVuc(khuVuc);

        return banRepository.save(ban);
    }

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

    public void delete(String id) {
        Ban ban = banRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay ban voi ma: " + id));

        ban.setTrangThaiBan(MAINTENANCE_STATUS);
        banRepository.save(ban);
    }
}
