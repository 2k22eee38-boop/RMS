package com.example.RMS.service.serviceImpl;

import com.example.RMS.dto.Response.AuthResponse;
import com.example.RMS.dto.Request.LoginRequest;
import com.example.RMS.dto.Request.UserRequest;
import com.example.RMS.entity.User;
import com.example.RMS.repository.UserRepository;
import com.example.RMS.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // In a real app, compare hashed passwords. Here we just compare plain text for simplicity.
            if (user.getPassword().equals(request.getPassword())) {
                return new AuthResponse(user.getId(), user.getUsername(), user.getRole(), "dummy-jwt-token-for-" + user.getUsername());
            }
        }
        throw new RuntimeException("Invalid credentials");
    }

    @Override
    public AuthResponse register(UserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // In real app, hash this
        user.setRole(User.Role.RESIDENT);
        User savedUser = userRepository.save(user);
        return new AuthResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getRole(), "dummy-jwt-token-for-" + savedUser.getUsername());
    }
}
