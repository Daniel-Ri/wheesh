package com.daniel.wheesh.global;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public class Utility {
    private static final String[] FIRST_NAMES = {"John", "Jane", "Alice", "Bob", "Charlie", "Agus", "Asep", "Slamet",
        "Dewi", "Nur"};
    private static final String[] LAST_NAMES = {"Doe", "Smith", "Johnson", "Williams", "Brown", "Ganteng", "Cantik"};
    private static final String CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final int RANDOM_PART_LENGTH = 8;
    private static final String DOMAIN = "example.com";
    private static final SecureRandom random = new SecureRandom();

    public static LocalDate getRandomDOB() {
        LocalDate startDateLimit = LocalDate.now().minusYears(100);
        LocalDate endDateLimit = LocalDate.now().minusYears(17);

        long randomDays = ThreadLocalRandom.current().nextLong(ChronoUnit.DAYS.between(startDateLimit, endDateLimit));
        return startDateLimit.plusDays(randomDays);
    }

    public static String generateRandomId() {
        StringBuilder randomId = new StringBuilder();
        for (int i = 0; i < 16; i++) {
            randomId.append(random.nextInt(10));
        }
        return randomId.toString();
    }

    public static String generateRandomName() {
        String firstName = FIRST_NAMES[random.nextInt(FIRST_NAMES.length)];
        String lastName = LAST_NAMES[random.nextInt(LAST_NAMES.length)];
        return firstName + " " + lastName;
    }

    public static String generateRandomEmail() {
        StringBuilder randomPart = new StringBuilder();
        for (int i = 0; i < RANDOM_PART_LENGTH; i++) {
            randomPart.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return randomPart + "@" + DOMAIN;
    }

    public static String generateRandomSecret() {
        return new BigInteger(130, random).toString(32);
    }

    public static <T> List<T> select80PercentRandomly(List<T> inputList) {
        // Calculate the number of elements to select (80%)
        int selectionSize = (int) Math.ceil(0.8 * inputList.size());

        return selectRandomly(inputList, selectionSize);
    }

    public static <T> List<T> selectRandomly(List<T> inputList, int selectionSize) {
        // Clone the list to avoid modifying the original list
        List<T> shuffledList = new ArrayList<>(inputList);

        // Shuffle the cloned list
        Collections.shuffle(shuffledList);

        // Slice the list to get the first 80% of the shuffled list
        return shuffledList.subList(0, selectionSize);
    }
}
