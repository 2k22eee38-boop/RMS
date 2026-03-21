package com.example.RMS.config;

import com.example.RMS.entity.User;
import com.example.RMS.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.findByUsername("diya@gmail.com").isEmpty()) {
                User user = new User();
                user.setUsername("diya@gmail.com");
                user.setPassword("1234");
                user.setRole(User.Role.RESIDENT);
                userRepository.save(user);
                log.info("Default user 'diya@gmail.com' created with password '1234'");
            } else {
                log.info("User 'diya@gmail.com' already exists");
            }

            if (userRepository.findByUsername("manager").isEmpty()) {
                User admin = new User();
                admin.setUsername("manager");
                admin.setPassword("admin");
                admin.setRole(User.Role.MANAGER);
                userRepository.save(admin);
                log.info("Default manager 'manager' created with password 'admin'");
            }
        };
    }
}
