package com.pig.backend.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        ex.printStackTrace();
        Map<String, Object> error = new HashMap<>();
        error.put("status", 500);
        error.put("error", ex.getClass().getSimpleName());
        error.put("message", ex.getMessage());
        Throwable cause = ex.getCause();
        if (cause != null) {
            error.put("cause", cause.getMessage());
            if (cause.getCause() != null) {
                error.put("rootCause", cause.getCause().getMessage());
            }
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
