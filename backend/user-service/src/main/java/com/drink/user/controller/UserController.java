package com.drink.user.controller;

import com.drink.user.common.Response;
import com.drink.user.dto.CreateUserRequest;
import com.drink.user.dto.LoginRequest;
import com.drink.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    @Description("회원가입")
    public Response createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @PostMapping("/login")
    @Description("로그인")
    public Response login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @GetMapping("/me")
    @Description("내 정보 조회")
    public Response getMyInfo(@RequestHeader("X-User-Id") Long userId) {
        return userService.getMyInfo(userId);
    }

}
