package com.drink.user.service;

import com.drink.user.common.Response;
import com.drink.user.common.ResponseCode;
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
        Response<UserDto> result = userService.createUser(createUserRequest);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getCode()).isEqualTo(ResponseCode.SUCCESS.getCode());
        assertThat(result.getData().getId()).isEqualTo(1L);
        assertThat(result.getData().getEmail()).isEqualTo(createUserRequest.email());
        assertThat(result.getData().getNickname()).isEqualTo(createUserRequest.nickname());

        verify(userRepository).existsByEmail(createUserRequest.email());
        verify(userRepository).existsByNickname(createUserRequest.nickname());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("createUser - 이미 존재하는 이메일이면 에러 응답을 반환한다")
    void 이미_존재하는_이메일이면_에러_응답을_반환한다() {
        // given
        given(userRepository.existsByEmail(createUserRequest.email())).willReturn(true);

        // when
        Response<?> result = userService.createUser(createUserRequest);

        // then
        assertThat(result.getCode()).isEqualTo(ResponseCode.EMAIL_ALREADY_EXIST.getCode());
        assertThat(result.getMessage()).isEqualTo(ResponseCode.EMAIL_ALREADY_EXIST.getMessage());
        assertThat(result.getData()).isNull();

        verify(userRepository).existsByEmail(createUserRequest.email());
        verify(userRepository, never()).existsByNickname(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("createUser - 이미 존재하는 닉네임이면 에러 응답을 반환한다")
    void 이미_존재하는_닉네임이면_에러_응답을_반환한다() {
        // given
        given(userRepository.existsByEmail(createUserRequest.email())).willReturn(false);
        given(userRepository.existsByNickname(createUserRequest.nickname())).willReturn(true);

        // when
        Response<?> result = userService.createUser(createUserRequest);

        // then
        assertThat(result.getCode()).isEqualTo(ResponseCode.NICKNAME_ALREADY_EXIST.getCode());
        assertThat(result.getMessage()).isEqualTo(ResponseCode.NICKNAME_ALREADY_EXIST.getMessage());
        assertThat(result.getData()).isNull();

        verify(userRepository).existsByEmail(createUserRequest.email());
        verify(userRepository).existsByNickname(createUserRequest.nickname());
        verify(userRepository, never()).save(any());
    }
}
