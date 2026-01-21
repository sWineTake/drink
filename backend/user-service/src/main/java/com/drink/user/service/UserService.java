package com.drink.user.service;

import com.drink.user.dto.CreateUserRequest;
import com.drink.user.dto.UserDto;
import com.drink.user.entity.User;
import com.drink.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + id));
        return toDto(user);
    }

    @Transactional
    public UserDto createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("이미 존재하는 이메일입니다");
        }
        if (userRepository.existsByNickname(request.nickname())) {
            throw new RuntimeException("이미 존재하는 닉네임입니다");
        }

        User user = User.builder()
                .email(request.email())
                .password(request.password())
                .nickname(request.nickname())
                .build();

        return toDto(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("사용자를 찾을 수 없습니다: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
