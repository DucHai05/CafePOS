package com.example.servicedoanhthu.service;

import com.example.servicedoanhthu.entity.Ca;
import com.example.servicedoanhthu.entity.DoanhThu;
import com.example.servicedoanhthu.entity.PhieuThuChi;
import com.example.servicedoanhthu.repository.CaRepository;
import com.example.servicedoanhthu.repository.DoanhThuRepository;
import com.example.servicedoanhthu.repository.PhieuThuChiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PhieuThuChiService {
    @Autowired
    private PhieuThuChiRepository phieuThuChiRepository;
    @Autowired
    private DoanhThuRepository doanhThuRepository;
    @Autowired
    private CaRepository caRepository;

    public List<PhieuThuChi> getAll() {
        return phieuThuChiRepository.findAll();
    }

    public PhieuThuChi getById(String maPhieu) {
        return phieuThuChiRepository.findById(maPhieu)
                .orElseThrow(() -> new RuntimeException("Khong tim thay phieu thu chi voi ma: " + maPhieu));
    }

    public List<PhieuThuChi> getByMaCa(String maCa) {
        return phieuThuChiRepository.findByMaCa(maCa);
    }

    @Transactional
    public PhieuThuChi create(PhieuThuChi phieuThuChi) {
        if (phieuThuChi.getSoTien() == null || phieuThuChi.getSoTien().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("So tien khong hop le");
        }

        String loaiPhieu = normalize(phieuThuChi.getLoaiPhieu());
        String prefix = resolvePrefix(loaiPhieu);

        phieuThuChi.setLoaiPhieu(formatLoaiPhieu(loaiPhieu));
        phieuThuChi.setMaPhieu(generateMaPhieu(prefix));

        Ca ca = caRepository.findById(phieuThuChi.getMaCa())
                .orElseThrow(() -> new RuntimeException("Khong tim thay ca voi ma: " + phieuThuChi.getMaCa()));

        DoanhThu doanhThu = doanhThuRepository.findFirstByMaCa(phieuThuChi.getMaCa())
                .orElseGet(() -> initDoanhThu(phieuThuChi.getMaCa()));

        BigDecimal soTien = defaultValue(phieuThuChi.getSoTien());

        if ("thu".equals(loaiPhieu)) {
            doanhThu.setTienThu(defaultValue(doanhThu.getTienThu()).add(soTien));
            ca.setSoTienKet(defaultValue(ca.getSoTienKet()).add(soTien));
        } else if ("chi".equals(loaiPhieu)) {
            doanhThu.setTienChi(defaultValue(doanhThu.getTienChi()).add(soTien));
            ca.setSoTienKet(defaultValue(ca.getSoTienKet()).subtract(soTien));
        } else {
            throw new RuntimeException("Loai phieu khong hop le. Chi nhan 'Thu' hoac 'Chi'");
        }

        PhieuThuChi savedPhieuThuChi = phieuThuChiRepository.save(phieuThuChi);
        doanhThuRepository.save(doanhThu);
        caRepository.save(ca);

        return savedPhieuThuChi;
    }

    private DoanhThu initDoanhThu(String maCa) {
        DoanhThu doanhThu = new DoanhThu();
        doanhThu.setMaDoanhThu("DT-" + maCa);
        doanhThu.setMaCa(maCa);
        doanhThu.setTienMat(BigDecimal.ZERO);
        doanhThu.setTienCK(BigDecimal.ZERO);
        doanhThu.setTienThu(BigDecimal.ZERO);
        doanhThu.setTienChi(BigDecimal.ZERO);
        return doanhThu;
    }

    private BigDecimal defaultValue(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String normalize(String loaiPhieu) {
        return loaiPhieu == null ? "" : loaiPhieu.trim().toLowerCase();
    }

    private String resolvePrefix(String loaiPhieu) {
        if ("thu".equals(loaiPhieu)) {
            return "THU";
        }
        if ("chi".equals(loaiPhieu)) {
            return "CHI";
        }
        throw new RuntimeException("Loai phieu khong hop le. Chi nhan 'Thu' hoac 'Chi'");
    }

    private String formatLoaiPhieu(String loaiPhieu) {
        return "thu".equals(loaiPhieu) ? "Thu" : "Chi";
    }

    private String generateMaPhieu(String prefix) {
        int nextNumber = phieuThuChiRepository.findTopByMaPhieuStartingWithOrderByMaPhieuDesc(prefix)
                .map(PhieuThuChi::getMaPhieu)
                .map(this::extractSequenceNumber)
                .orElse(0) + 1;

        return "%s%03d".formatted(prefix, nextNumber);
    }

    private int extractSequenceNumber(String maPhieu) {
        try {
            return Integer.parseInt(maPhieu.replaceAll("\\D+", ""));
        } catch (NumberFormatException ex) {
            return 0;
        }
    }
}
