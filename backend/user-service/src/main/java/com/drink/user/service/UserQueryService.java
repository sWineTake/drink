package com.drink.user.service;

import com.drink.user.dto.CreateUserRequest;
import com.drink.user.dto.LoginRequest;
import com.drink.user.entity.User;
import com.drink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserQueryService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean isUserEmailDuplicate(CreateUserRequest request) {
        return userRepository.existsByEmail(request.email());
    }

    public boolean isUserNicknameDuplicate(CreateUserRequest request) {
        return userRepository.existsByNickname(request.nickname());
    }

    public Optional<User> findByEmailAndValidatePassword(LoginRequest request) {
        return userRepository.findByEmail(request.email())
                .filter(user -> passwordEncoder.matches(request.password(), user.getPassword()));
    }

}
