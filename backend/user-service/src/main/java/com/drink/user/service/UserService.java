package com.drink.user.service;

import com.drink.user.common.Response;
import com.drink.user.common.ResponseCode;
import com.drink.user.dto.CreateUserRequest;
import com.drink.user.dto.UserDto;
import com.drink.user.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserQueryService query;
    private final UserCommandService command;

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


}
