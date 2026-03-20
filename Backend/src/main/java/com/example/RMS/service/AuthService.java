package com.example.RMS.service;

import com.example.RMS.dto.Request.LoginRequest;
import com.example.RMS.dto.Request.UserRequest;
import com.example.RMS.dto.Response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(UserRequest request);
}
