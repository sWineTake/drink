package com.drink.user.service;

import com.drink.user.dto.CreateUserRequest;
import com.drink.user.dto.UserDto;
import com.drink.user.entity.User;
import com.drink.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCommandService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto saveUser(CreateUserRequest request) {
        String encodedPassword = passwordEncoder.encode(request.password());
        User user = User.of(request.email(), encodedPassword, request.nickname());
        User saveUser = userRepository.save(user);
        return UserDto.from(saveUser);
    }

}
