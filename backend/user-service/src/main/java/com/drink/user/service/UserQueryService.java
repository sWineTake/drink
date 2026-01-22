package com.drink.user.service;

import com.drink.user.dto.CreateUserRequest;
import com.drink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserQueryService {

    private final UserRepository userRepository;

    public boolean isUserEmailDuplicate(CreateUserRequest request) {
        return userRepository.existsByEmail(request.email());
    }

    public boolean isUserNicknameDuplicate(CreateUserRequest request) {
        return userRepository.existsByNickname(request.nickname());
    }


}
