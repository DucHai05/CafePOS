package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// @RestControllerAdvice: Khai báo đây là "Cái phễu" đón lõng toàn bộ lỗi của hệ thống
@RestControllerAdvice
public class GlobalExceptionHandler {

    // @ExceptionHandler: Báo cho phễu biết đây là bộ lọc chuyên xử lý lỗi Validation (dữ liệu đầu vào)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> xuLyLoiValidation(MethodArgumentNotValidException ex) {

        // Tạo một cái Map (Tương đương 1 Object JSON) để chứa danh sách lỗi
        Map<String, String> danhSachLoi = new HashMap<>();

        // Lục lọi trong đống lỗi mà Spring Boot giấu đi, lấy ra tên cột bị sai và câu chửi tiếng Việt tương ứng
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            danhSachLoi.put(error.getField(), error.getDefaultMessage());
        });

        // Trả cục JSON tuyệt đẹp này ra cho Postman/Front-end
        return new ResponseEntity<>(danhSachLoi, HttpStatus.BAD_REQUEST);
    }


    // trả về lỗi 404
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex){
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // Hứng đủ thứ lỗi trên đời
    @ExceptionHandler(Exception.class) // Exception là "ông tổ" của mọi loại lỗi
    public ResponseEntity<Map<String, String>> handleAllOtherExceptions(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "Có lỗi hệ thống xảy ra: " + ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR); // Mã 500
    }
}