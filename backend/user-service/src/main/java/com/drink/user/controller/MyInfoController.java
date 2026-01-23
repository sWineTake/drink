package com.drink.user.controller;

import com.drink.user.common.Response;
import com.drink.user.service.MyInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Description;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/myinfo")
@RequiredArgsConstructor()
public class MyInfoController {

    private final MyInfoService myInfoService;

    @GetMapping
    @Description("내 정보 조회")
    public Response getMyInfo(@RequestHeader("X-User-Id") Long userId) {
        return myInfoService.getMyInfo(userId);
    }

}
