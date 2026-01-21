package com.drink.user.service;

import com.drink.user.dto.CreateUserRequest;
import com.drink.user.dto.UserDto;
import com.drink.user.entity.User;
import com.drink.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private CreateUserRequest createUserRequest;

    @BeforeEach
    void setUp() {
        // 레코드 생성 - 일반 클래스와 동일
        createUserRequest = new CreateUserRequest(
                "test@example.com",
                "password123",
                "testuser"
        );
    }

    @Test
    @DisplayName("createUser - 성공적으로 사용자를 생성한다")
    void 성공적으로_사용자를_생성한다() {
        // given
        User savedUser = User.builder()
                .id(1L)
                .email(createUserRequest.email())
                .password(createUserRequest.password())
                .nickname(createUserRequest.nickname())
                .createdAt(LocalDateTime.now())
                .build();

        given(userRepository.existsByEmail(createUserRequest.email())).willReturn(false);
        given(userRepository.existsByNickname(createUserRequest.nickname())).willReturn(false);
        given(userRepository.save(any(User.class))).willReturn(savedUser);

        // when
        UserDto result = userService.createUser(createUserRequest);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getEmail()).isEqualTo(createUserRequest.email());
        assertThat(result.getNickname()).isEqualTo(createUserRequest.nickname());

        verify(userRepository).existsByEmail(createUserRequest.email());
        verify(userRepository).existsByNickname(createUserRequest.nickname());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("createUser - 이미 존재하는 이메일이면 예외를 던진다")
    void 이미_존재하는_이메일이면_예외를_던진다() {
        // given
        given(userRepository.existsByEmail(createUserRequest.email())).willReturn(true);

        // when & then
        assertThatThrownBy(() -> userService.createUser(createUserRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("이미 존재하는 이메일입니다");

        verify(userRepository).existsByEmail(createUserRequest.email());
        verify(userRepository, never()).existsByNickname(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("createUser - 이미 존재하는 닉네임이면 예외를 던진다")
    void 이미_존재하는_닉네임이면_예외를_던진다() {
        // given
        given(userRepository.existsByEmail(createUserRequest.email())).willReturn(false);
        given(userRepository.existsByNickname(createUserRequest.nickname())).willReturn(true);

        // when & then
        assertThatThrownBy(() -> userService.createUser(createUserRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("이미 존재하는 닉네임입니다");

        verify(userRepository).existsByEmail(createUserRequest.email());
        verify(userRepository).existsByNickname(createUserRequest.nickname());
        verify(userRepository, never()).save(any());
    }
}
