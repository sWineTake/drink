package com.drink.user.utils;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class PasswordUtil {

    // 8자 이상, 영문 최소 1개, 숫자 최소 1개
    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*#?&]{8,}$");

    public static boolean isValid(String password) {
        if (password == null || password.isBlank()) {
            return false;
        }
        return !PASSWORD_PATTERN.matcher(password).matches();
    }

}
