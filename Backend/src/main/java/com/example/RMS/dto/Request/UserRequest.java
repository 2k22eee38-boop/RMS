package com.example.RMS.dto.Request;

import com.example.RMS.entity.User;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String password;
    private User.Role role;
    private String flatNo;
    private String familyLeader;
    private Integer memberCount;
    private String phone;
    private String email;
}
