package com.example.backend_javabuilder.controller;

import com.example.backend_javabuilder.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {


    UserService userService;

    @GetMapping("/user/{id}")
    public String getUser(@PathVariable int id){
        return userService.getUserByID(id);
    }


}
