package com.daniel.wheesh.constraints;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = UniqueSeatIdValidator.class)
@Target({ElementType.TYPE_USE, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueSeatId {
    String message() default "Seat IDs must be unique";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}