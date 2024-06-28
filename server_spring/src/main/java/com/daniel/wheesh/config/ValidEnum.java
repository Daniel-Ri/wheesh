package com.daniel.wheesh.config;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EnumValidator.class)
@Documented
public @interface ValidEnum {
    Class<? extends Enum<?>> enumClass();
    String message() default "Invalid value. This is not permitted.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    boolean required() default true;
}