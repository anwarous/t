package com.learningplusplus.api.config;

import com.learningplusplus.api.model.User;
import com.learningplusplus.api.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class AdminAccountInitializer implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@admin.admin";
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminAccountInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        User admin = userRepository.findByUsername(ADMIN_USERNAME)
            .or(() -> userRepository.findByEmail(ADMIN_EMAIL))
            .orElseGet(User::new);

        admin.setUsername(ADMIN_USERNAME);
        admin.setEmail(ADMIN_EMAIL);
        admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
        admin.setDisplayName("Administrator");
        admin.setAvatarInitials("AD");
        admin.setRoles(new HashSet<>(Set.of("ADMIN", "USER")));

        userRepository.save(admin);
    }
}
