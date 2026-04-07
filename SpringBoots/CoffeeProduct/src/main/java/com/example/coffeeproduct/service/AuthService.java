package com.example.coffeeproduct.service;


import com.example.coffeeproduct.entity.NhanVien;
import com.example.coffeeproduct.entity.TaiKhoan;
import com.example.coffeeproduct.repository.NhanVienRepository;
import com.example.coffeeproduct.repository.TaiKhoanRepository;
import jakarta.transaction.Transactional;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.Random;
import java.util.Optional;

@Service
public class AuthService {

    private final TaiKhoanRepository taiKhoanRepository;
    private final NhanVienRepository nhanVienRepository;
    private final JavaMailSender javaMailSender;

    public AuthService(TaiKhoanRepository taiKhoanRepository, NhanVienRepository nhanVienRepository, JavaMailSender javaMailSender) {
        this.taiKhoanRepository = taiKhoanRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.javaMailSender = javaMailSender;
    }


    @Transactional // Đảm bảo lưu cả 2 bảng cùng lúc hoặc không lưu gì cả
    public String register(String tenDangNhap, String email){
        Optional<TaiKhoan> taiKhoanOptional = taiKhoanRepository.findTaiKhoanByTenDangNhap(tenDangNhap);
        if(taiKhoanOptional.isPresent()){
            return "Vui lòng sử dụng tên đăng nhập khác!";
        } else {
            String randomMaNV = "NV" + (1000 + new Random().nextInt(9000));
            String randomMaTK = "TK" + (1000 + new Random().nextInt(9000));
            String randomPassword = UUID.randomUUID().toString().substring(0, 8);
            NhanVien nhanVien = new NhanVien();
            nhanVien.setMaNhanVien(randomMaNV);
            nhanVien.setTenNhanVien("Nhân viên mới");
            nhanVienRepository.save(nhanVien);

            TaiKhoan moi = new TaiKhoan();
            moi.setMaTaiKhoan(randomMaTK);
            moi.setMaNhanVien(randomMaNV);
            moi.setLoaiTaiKhoan("NHANVIEN");
            moi.setTenDangNhap(tenDangNhap);
            moi.setMatKhau(randomPassword);
            moi.setEmail(email);
            taiKhoanRepository.save(moi);
            return "Đăng ký thành công \n Tên đăng nhập: "+tenDangNhap+"\n Mật khẩu: "+randomPassword;
        }

    }
    public String login(String tenDangNhap, String matKhau){
        Optional<TaiKhoan> taiKhoanOptional = taiKhoanRepository.findTaiKhoanByTenDangNhap(tenDangNhap);

        if(taiKhoanOptional.isPresent()){
            TaiKhoan taiKhoan = taiKhoanOptional.get();
            if(taiKhoan.getMatKhau().equals(matKhau)){
                return "Đăng nhập thành công!";
            } else {
                return "Mật khẩu không chính xác!";
            }
        } else {
            return "Tài khoản không tồn tại!";
        }
    }

    public String forgotPassword(String email){
        Optional<TaiKhoan> optionalTK = taiKhoanRepository.findByEmail(email);
        if(optionalTK.isPresent()){
            TaiKhoan taiKhoan = optionalTK.get();
            String randomOTP = String.format("%06d", new Random().nextInt(999999));
            taiKhoan.setOTP(randomOTP);
            taiKhoanRepository.save(taiKhoan);

            sendOTPEmail(email, randomOTP);
            return "Mã OTP đã được gửi về Email của bạn!";
        }
        return "Email không tồn tại, vui lòng nhập lại!";
    }
    public String ResetPassword(String email, String OTP, String matKhau){
        Optional<TaiKhoan> optionalTK = taiKhoanRepository.findByEmail(email);
        if (optionalTK.isPresent()) {
            TaiKhoan tKhoan = optionalTK.get();
            if (tKhoan.getOTP() != null && tKhoan.getOTP().equals(OTP)) {
                tKhoan.setMatKhau(matKhau);
                tKhoan.setOTP(null);
                taiKhoanRepository.save(tKhoan);
                return "Đặt lại mật khẩu thành công!";
            }
        }
        return "Mã OTP không chính xác hoặc đã hết hạn!";

    }
    private void sendOTPEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã xác thực khôi phục mật khẩu - CoffeeProduct");
        message.setText("Mã OTP của bạn là: " + otp + "\nLưu ý: Mã có hiệu lực trong 5 phút.");
        javaMailSender.send(message);
    }
}
