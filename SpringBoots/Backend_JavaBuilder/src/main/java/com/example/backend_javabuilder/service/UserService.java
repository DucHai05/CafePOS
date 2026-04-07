package com.example.backend_javabuilder.service;


import com.example.backend_javabuilder.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public final UserRepository userRepository;
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }


    public String getUserByID(int id){
        if(id <= 0 ) return "Id invalid!";
        String userName = "Bui Duc Hai";
        String email = "toilahai@gmail.com";
        return "User: "+userName+ " Email: "+email;
    }


}
