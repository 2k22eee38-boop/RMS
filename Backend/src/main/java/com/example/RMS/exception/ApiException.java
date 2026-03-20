package com.example.RMS.exception;

public class ApiException extends RuntimeException {
    public ApiException(String message) {
        super(message);
    }
}
