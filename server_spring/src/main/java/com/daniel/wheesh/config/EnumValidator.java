package com.daniel.wheesh.config;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;

public class EnumValidator implements ConstraintValidator<ValidEnum, String> {
    private Class<? extends Enum<?>> enumClass;
    private boolean required;

    @Override
    public void initialize(ValidEnum constraintAnnotation) {
        this.enumClass = constraintAnnotation.enumClass();
        this.required = constraintAnnotation.required();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (!required && value == null) {
            return true;
        }

        if (value == null) {
            return false;
        }
        return Arrays.stream(enumClass.getEnumConstants())
            .anyMatch(e -> e.name().equals(value));
    }
}
