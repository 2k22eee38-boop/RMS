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
    private String token; // We'll just pass a dummy token or username for simplicity in this exercise, as JWT isn't strictly requested, but good to have a dedicated response.
}


