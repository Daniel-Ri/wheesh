package com.daniel.wheesh.passenger;

import com.daniel.wheesh.user.User;
import com.daniel.wheesh.user.UserRepository;
import com.daniel.wheesh.user.UserSeeder;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class PassengerSeeder {
    private static final Logger logger = LoggerFactory.getLogger(PassengerSeeder.class);

    private final UserRepository userRepository;

    private final PassengerRepository passengerRepository;

    public void seedPassengers() throws Exception {
        if (passengerRepository.count() == 0) {
            logger.info("No passengers found in the database. Seeding initial data.");

            User user1 = userRepository.findById(1L).orElseThrow(() -> new Exception("Something wrong happen"));
            User user2 = userRepository.findById(2L).orElseThrow(() -> new Exception("Something wrong happen"));
            User user3 = userRepository.findById(3L).orElseThrow(() -> new Exception("Something wrong happen"));
            User user4 = userRepository.findById(4L).orElseThrow(() -> new Exception("Something wrong happen"));
            User user5 = userRepository.findById(5L).orElseThrow(() -> new Exception("Something wrong happen"));
            User user6 = userRepository.findById(6L).orElseThrow(() -> new Exception("Something wrong happen"));

            Passenger[] passengers = new Passenger[]{
                Passenger.builder()
                    .user(user1)
                    .isUser(true)
                    .gender(Gender.Male)
                    .dateOfBirth(LocalDate.of(1995, 9, 14))
                    .idCard("1243567890123456")
                    .name("Bang Joe")
                    .email("bangjoe@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user2)
                    .isUser(true)
                    .gender(Gender.Male)
                    .dateOfBirth(LocalDate.of(1995, 10, 12))
                    .idCard("1234567890123456")
                    .name("John Doe")
                    .email("johndoe@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user2)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1997, 1, 1))
                    .idCard("1234567890123496")
                    .name("Jean Doe")
                    .email("jeandoe@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user3)
                    .isUser(true)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1997, 1, 1))
                    .idCard("1234567890123496")
                    .name("Jean Doe")
                    .email("jeandoe@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(true)
                    .gender(Gender.Male)
                    .dateOfBirth(LocalDate.of(1995, 10, 12))
                    .idCard("1234567890123457")
                    .name("Agus Ganteng")
                    .email("agus@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Male)
                    .dateOfBirth(LocalDate.of(1997, 2, 3))
                    .idCard("1234567890123499")
                    .name("Asep Ganteng")
                    .email("asep@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Male)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123500")
                    .name("Slamet Ganteng")
                    .email("slamet@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123502")
                    .name("Siti Cantik")
                    .email("siti@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123503")
                    .name("Sri Cantik")
                    .email("sri@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123504")
                    .name("Nur Cantik")
                    .email("nur@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123505")
                    .name("Ni Cantik")
                    .email("ni@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123506")
                    .name("Dewi Cantik")
                    .email("dewi@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123507")
                    .name("Endang Cantik")
                    .email("endang@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123508")
                    .name("Maria Cantik")
                    .email("maria@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123509")
                    .name("Ida Cantik")
                    .email("ida@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123510")
                    .name("Nurul Cantik")
                    .email("nurul@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Female)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123511")
                    .name("Wayan Cantik")
                    .email("wayan@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Male)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123512")
                    .name("Andy Tulen")
                    .email("andy@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user4)
                    .isUser(false)
                    .gender(Gender.Male)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123513")
                    .name("Satria Tulen")
                    .email("satria@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user5)
                    .isUser(false)
                    .gender(Gender.Male)
                    .dateOfBirth(LocalDate.of(1997, 2, 3))
                    .idCard("1234567890123499")
                    .name("Asep Ganteng")
                    .email("asep@gmail.com")
                    .build(),
                Passenger.builder()
                    .user(user6)
                    .isUser(false)
                    .gender(Gender.Male)
                    .dateOfBirth(LocalDate.of(1998, 1, 30))
                    .idCard("1234567890123500")
                    .name("Slamet Ganteng")
                    .email("slamet@gmail.com")
                    .build(),
            };
            passengerRepository.saveAll(Arrays.asList(passengers));
            logger.info("Seeded initial passengers data");
        } else {
            logger.info("Passengers already exist in the database. No seeding needed.");
        }
    }

    public void unseedPassengers() {
        logger.info("Deleting all passengers data.");
        passengerRepository.deleteAll();
        logger.info("All passengers data deleted.");
    }
}
