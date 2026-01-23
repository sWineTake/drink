package com.drink.user.service;

import com.drink.user.common.Response;
import com.drink.user.common.ResponseCode;
import com.drink.user.dto.UserDto;
import com.drink.user.entity.User;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyInfoService {

    private final UserQueryService query;

    public Response getMyInfo(Long userId) {

        Optional<User> optionalUser = query.findById(userId);

        if (optionalUser.isEmpty()) {
            Response.of(ResponseCode.USER_NOT_FOUND);
        }

        return Response.of(UserDto.from(optionalUser.get()));

    }

}
