package com.example.RMS.dto.Response;

import com.example.RMS.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String username;
    private User.Role role;
    private String token;
}
