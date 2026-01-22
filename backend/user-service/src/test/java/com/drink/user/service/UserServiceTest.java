package com.drink.user.service;

import com.drink.user.common.Response;
import com.drink.user.common.ResponseCode;
import com.drink.user.dto.CreateUserRequest;
import com.drink.user.dto.UserDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserQueryService query;

    @Mock
    private UserCommandService command;

    @InjectMocks
    private UserService userService;

    private CreateUserRequest createUserRequest;

    @BeforeEach
    void setUp() {
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
        UserDto savedUserDto = new UserDto(
            1L,
            createUserRequest.email(),
            createUserRequest.nickname(),
            null,
            LocalDateTime.now()
        );

        given(query.isUserEmailDuplicate(createUserRequest)).willReturn(false);
        given(query.isUserNicknameDuplicate(createUserRequest)).willReturn(false);
        given(command.saveUser(createUserRequest)).willReturn(savedUserDto);

        // when
        Response<UserDto> result = userService.createUser(createUserRequest);

        // then
        assertThat(result).isNotNull();
        assertThat(result.getCode()).isEqualTo(ResponseCode.SUCCESS.getCode());
        assertThat(result.getData().id()).isEqualTo(1L);
        assertThat(result.getData().email()).isEqualTo(createUserRequest.email());
        assertThat(result.getData().nickname()).isEqualTo(createUserRequest.nickname());

        verify(query).isUserEmailDuplicate(createUserRequest);
        verify(query).isUserNicknameDuplicate(createUserRequest);
        verify(command).saveUser(createUserRequest);
    }

    @Test
    @DisplayName("createUser - 이미 존재하는 이메일이면 에러 응답을 반환한다")
    void 이미_존재하는_이메일이면_에러_응답을_반환한다() {
        // given
        given(query.isUserEmailDuplicate(createUserRequest)).willReturn(true);

        // when
        Response<?> result = userService.createUser(createUserRequest);

        // then
        assertThat(result.getCode()).isEqualTo(ResponseCode.EMAIL_ALREADY_EXIST.getCode());
        assertThat(result.getMessage()).isEqualTo(ResponseCode.EMAIL_ALREADY_EXIST.getMessage());
        assertThat(result.getData()).isNull();

        verify(query).isUserEmailDuplicate(createUserRequest);
        verify(query, never()).isUserNicknameDuplicate(createUserRequest);
        verify(command, never()).saveUser(createUserRequest);
    }

    @Test
    @DisplayName("createUser - 이미 존재하는 닉네임이면 에러 응답을 반환한다")
    void 이미_존재하는_닉네임이면_에러_응답을_반환한다() {
        // given
        given(query.isUserEmailDuplicate(createUserRequest)).willReturn(false);
        given(query.isUserNicknameDuplicate(createUserRequest)).willReturn(true);

        // when
        Response<?> result = userService.createUser(createUserRequest);

        // then
        assertThat(result.getCode()).isEqualTo(ResponseCode.NICKNAME_ALREADY_EXIST.getCode());
        assertThat(result.getMessage()).isEqualTo(ResponseCode.NICKNAME_ALREADY_EXIST.getMessage());
        assertThat(result.getData()).isNull();

        verify(query).isUserEmailDuplicate(createUserRequest);
        verify(query).isUserNicknameDuplicate(createUserRequest);
        verify(command, never()).saveUser(createUserRequest);
    }
}