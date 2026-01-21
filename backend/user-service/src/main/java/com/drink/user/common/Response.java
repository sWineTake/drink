package com.drink.user.common;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Response<T> {

    private String message;
    private int code;
    private T data;

    public static <T> Response<T> of(T data) {

        Response<T> tResponse = new Response<>();
        tResponse.data = data;
        tResponse.code = ResponseCode.SUCCESS.getCode();
        tResponse.message = ResponseCode.SUCCESS.getMessage();
        return tResponse;

    }

    public static Response<Void> of(ResponseCode responseCode) {

        Response<Void> tResponse = new Response<>();
        tResponse.code = responseCode.getCode();
        tResponse.message = responseCode.getMessage();
        return tResponse;

    }


}
