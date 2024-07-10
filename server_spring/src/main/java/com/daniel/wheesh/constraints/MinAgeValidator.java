package com.daniel.wheesh.constraints;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class MinAgeValidator implements ConstraintValidator<MinAge, LocalDate> {
    private int minAge;
    private boolean required;

    @Override
    public void initialize(MinAge constraintAnnotation) {
        this.minAge = constraintAnnotation.value();
        this.required = constraintAnnotation.required();
    }

    @Override
    public boolean isValid(LocalDate dateOfBirth, ConstraintValidatorContext context) {
        if (!required && dateOfBirth == null) {
            return true; // If not required and dateOfBirth is null, consider it valid
        }

        if (dateOfBirth == null) {
            return false; // If required and dateOfBirth is null, it's invalid
        }

        LocalDate now = LocalDate.now();
        LocalDate minDate = now.minusYears(minAge);

        return dateOfBirth.isBefore(minDate);
    }
}
