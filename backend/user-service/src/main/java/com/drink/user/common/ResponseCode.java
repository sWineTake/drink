package com.drink.user.common;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ResponseCode {

    SUCCESS("성공저장되었습니다.", HttpStatus.OK.value()),
    EMAIL_ALREADY_EXIST("이메일이 이미 존재합니다.", HttpStatus.BAD_REQUEST.value()),
    NICKNAME_ALREADY_EXIST("이미 존재하는 닉네임입니다", HttpStatus.BAD_REQUEST.value());

    private String message;
    private int code;

    ResponseCode(String message, int code) {
        this.message = message;
        this.code = code;
    }
}
