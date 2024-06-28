package com.daniel.wheesh.global;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler({UsernameNotFoundException.class, BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleSpecificError(Exception ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse.builder().message(ex.getMessage()).build());
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomError(CustomException ex) {
        return ResponseEntity
            .status(ex.getStatus())
            .body(ErrorResponse.builder().message(ex.getMessage()).build());
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        // Create validation error details
        String errorMessage = "";

        // Only get the first error message
        for (ObjectError error: ex.getBindingResult().getAllErrors()) {
            // String fieldName = ((FieldError) error).getField();
            errorMessage = error.getDefaultMessage();
            break;
        }

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ValidationErrorResponse.builder()
                .message(errorMessage)
                .build()
            );
    }
}
