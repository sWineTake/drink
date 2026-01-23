package com.drink.user.service;

import com.drink.user.common.Response;
import com.drink.user.common.ResponseCode;
import com.drink.user.dto.CreateUserRequest;
import com.drink.user.dto.LoginRequest;
import com.drink.user.dto.LoginResponse;
import com.drink.user.dto.UserDto;
import com.drink.user.entity.User;
import com.drink.common.jwt.JwtUtil;
import com.drink.user.utils.PasswordUtil;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserQueryService query;
    private final UserCommandService command;
    private final JwtUtil jwtUtil;

    public Response createUser(CreateUserRequest request) {

        if (PasswordUtil.isValid(request.password())) {
            return Response.of(ResponseCode.PASSWORD_FAIL);
        }

        if (query.isUserEmailDuplicate(request)) {
            return Response.of(ResponseCode.EMAIL_ALREADY_EXIST);
        }

        if (query.isUserNicknameDuplicate(request)) {
            return Response.of(ResponseCode.NICKNAME_ALREADY_EXIST);
        }

        UserDto dto = command.saveUser(request);
        return Response.of(dto);

    }

    public Response login(LoginRequest request) {

        Optional<User> optionalUser = query.findByEmailAndValidatePassword(request);

        if (optionalUser.isEmpty()) {
            Response.of(ResponseCode.LOGIN_FAILED);
        }

        User user = optionalUser.get();
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return Response.of(LoginResponse.of(token));

    }

}
