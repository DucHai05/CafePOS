package com.example.service;

import com.example.entity.HoaDon;
import com.example.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class HoaDonService {
    private static final String BAN_SERVICE_URL = "http://localhost:8081/api/ban";

    @Autowired
    private HoaDonRepository hoaDonRepository;

    private final RestClient restClient = RestClient.builder()
            .baseUrl(BAN_SERVICE_URL)
            .build();

    public List<HoaDon> getAll() {
        return enrichTenBan(hoaDonRepository.findAll());
    }

    public HoaDon getById(String maHoaDon) {
        HoaDon hoaDon = hoaDonRepository.findById(maHoaDon)
                .orElseThrow(() -> new RuntimeException("Khong tim thay hoa don voi ma: " + maHoaDon));
        return enrichTenBan(hoaDon);
    }

    public List<HoaDon> getByMaBan(String maBan) {
        return enrichTenBan(hoaDonRepository.findByMaBan(maBan));
    }

    public List<HoaDon> getByMaCa(String maCa) {
        return enrichTenBan(hoaDonRepository.findByMaCa(maCa));
    }

    private List<HoaDon> enrichTenBan(List<HoaDon> hoaDons) {
        List<HoaDon> enrichedHoaDons = new ArrayList<>();
        for (HoaDon hoaDon : hoaDons) {
            enrichedHoaDons.add(enrichTenBan(hoaDon));
        }
        return enrichedHoaDons;
    }

    private HoaDon enrichTenBan(HoaDon hoaDon) {
        if (hoaDon == null || hoaDon.getMaBan() == null || hoaDon.getMaBan().isBlank()) {
            return hoaDon;
        }

        try {
            BanResponse ban = restClient.get()
                    .uri("/{maBan}", hoaDon.getMaBan())
                    .retrieve()
                    .body(BanResponse.class);

            if (ban != null) {
                hoaDon.setTenBan(ban.getTenBan());
            }
        } catch (Exception ignored) {
            hoaDon.setTenBan(null);
        }

        return hoaDon;
    }

    private static class BanResponse {
        private String tenBan;

        public String getTenBan() {
            return tenBan;
        }

        public void setTenBan(String tenBan) {
            this.tenBan = tenBan;
        }
    }
}
