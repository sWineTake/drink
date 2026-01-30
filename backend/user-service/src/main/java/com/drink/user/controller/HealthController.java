package com.drink.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/health")
public class HealthController {

    @Value("${MY_ACCOUNT:default}")
    private String myAccount;

    @GetMapping
    public String health() {
        return "ok - version - 1.1 / MY_ACCOUNT : " + myAccount;
    }

}
