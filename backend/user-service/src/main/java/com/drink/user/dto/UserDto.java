package com.drink.user.dto;

import com.drink.user.entity.User;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record UserDto(
        Long id,
        String email,
        String nickname,
        String profileImage,
        LocalDateTime createdAt
) {

    // 정적 팩토리 메서드
    public static UserDto from(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .createdAt(user.getCreatedAt())
                .build();
    }

}
