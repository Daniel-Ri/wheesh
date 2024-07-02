package com.daniel.wheesh.passenger;

import com.daniel.wheesh.user.LoginResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class PassengerControllerIntTest {
    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private PassengerRepository passengerRepository;

    private static String defaultToken;

    @BeforeAll
    static void beforeAll(@Autowired MockMvc mvc, @Autowired ObjectMapper objectMapper) throws Exception {
        String responseJson = mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "johndoe",
                            "password": "123456"
                        }
                        """)
            )
            .andReturn().getResponse().getContentAsString();

        LoginResponse userLoginResponse = objectMapper.readValue(responseJson, LoginResponse.class);
        defaultToken = userLoginResponse.getToken();
    }

    @Test
    void shouldSuccessGetPassengers() throws Exception {
        this.mvc.perform(
                get("/api/passenger")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data[0].id").exists())
            .andExpect(jsonPath("$.data[0].userId").exists())
            .andExpect(jsonPath("$.data[0].isUser").exists())
            .andExpect(jsonPath("$.data[0].gender").exists())
            .andExpect(jsonPath("$.data[0].dateOfBirth").exists())
            .andExpect(jsonPath("$.data[0].idCard").exists())
            .andExpect(jsonPath("$.data[0].name").exists())
            .andExpect(jsonPath("$.data[0].email").exists());
    }

    @Test
    void shouldSuccessGetOnePassenger() throws Exception {
        this.mvc.perform(
                get("/api/passenger/2")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.userId").exists())
            .andExpect(jsonPath("$.data.isUser").exists())
            .andExpect(jsonPath("$.data.gender").exists())
            .andExpect(jsonPath("$.data.dateOfBirth").exists())
            .andExpect(jsonPath("$.data.idCard").exists())
            .andExpect(jsonPath("$.data.name").exists())
            .andExpect(jsonPath("$.data.email").exists());
    }

    @Test
    void shouldFailedGetOnePassengerWhenPassengerIdIsNotThere() throws Exception {
        this.mvc.perform(
                get("/api/passenger/1000")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Passenger Not Found"));
    }

    @Test
    void shouldFailedGetOnePassengerWhenPassengerIsOwnedByOtherUser() throws Exception {
        this.mvc.perform(
                get("/api/passenger/1")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Not Authorized"));
    }

    @Test
    @DirtiesContext
    void shouldSuccessCreatePassenger() throws Exception {
        String responseJson = this.mvc.perform(
                post("/api/passenger")
                    .header("Authorization", "Bearer " + defaultToken)
                    .contentType("application/json")
                    .content("""
                        {
                            "gender": "Male",
                            "dateOfBirth": "2000-07-19",
                            "idCard": "1233234323563257",
                            "name": "James Bond",
                            "email": "jamesbond@gmail.com"
                        }
                        """)
            )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.userId").value(2))
            .andExpect(jsonPath("$.data.isUser").value("false"))
            .andExpect(jsonPath("$.data.gender").value("Male"))
            .andExpect(jsonPath("$.data.dateOfBirth").value("2000-07-19"))
            .andExpect(jsonPath("$.data.idCard").value("1233234323563257"))
            .andExpect(jsonPath("$.data.name").value("James Bond"))
            .andExpect(jsonPath("$.data.email").value("jamesbond@gmail.com"))
            .andReturn().getResponse().getContentAsString();

        OnePassengerResponse profileResponse = objectMapper.readValue(responseJson, OnePassengerResponse.class);
        Long passengerId = profileResponse.getPassenger().getId();
        this.mvc.perform(
                get("/api/passenger/%d".formatted(passengerId))
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk());
    }

    @Test
    @DirtiesContext
    void shouldSuccessCreatePassengerEvenEmailIsEmpty() throws Exception {
        String responseJson = this.mvc.perform(
                post("/api/passenger")
                    .header("Authorization", "Bearer " + defaultToken)
                    .contentType("application/json")
                    .content("""
                        {
                            "gender": "Male",
                            "dateOfBirth": "2000-07-19",
                            "idCard": "1233234323563257",
                            "name": "James Bond"
                        }
                        """)
            )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.userId").value(2))
            .andExpect(jsonPath("$.data.isUser").value("false"))
            .andExpect(jsonPath("$.data.gender").value("Male"))
            .andExpect(jsonPath("$.data.dateOfBirth").value("2000-07-19"))
            .andExpect(jsonPath("$.data.idCard").value("1233234323563257"))
            .andExpect(jsonPath("$.data.name").value("James Bond"))
            .andExpect(jsonPath("$.data.email").doesNotExist())
            .andReturn().getResponse().getContentAsString();

        OnePassengerResponse profileResponse = objectMapper.readValue(responseJson, OnePassengerResponse.class);
        Long passengerId = profileResponse.getPassenger().getId();
        this.mvc.perform(
                get("/api/passenger/%d".formatted(passengerId))
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk());
    }

    @Test
    void shouldFailedCreatePassengerWhenReachLimit() throws Exception {
        Long previousCount = passengerRepository.count();

        String responseJson = this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "agus",
                            "password": "123456"
                        }
                        """)
            )
            .andReturn().getResponse().getContentAsString();

        LoginResponse userLoginResponse = objectMapper.readValue(responseJson, LoginResponse.class);
        String agusToken = userLoginResponse.getToken();

        this.mvc.perform(
                post("/api/passenger")
                    .with(csrf())
                    .header("Authorization", "Bearer " + agusToken)
                    .contentType("application/json")
                    .content("""
                        {
                            "gender": "Male",
                            "dateOfBirth": "2000-07-19",
                            "idCard": "1233234323563257",
                            "name": "James Bond"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message")
                .value("You have reached the limit of creating passengers"));

        assertEquals(previousCount, passengerRepository.count());
    }

    @Test
    @DirtiesContext
    void shouldSuccessUpdatePassenger() throws Exception {
        this.mvc.perform(
                put("/api/passenger/3")
                    .with(csrf())
                    .header("Authorization", "Bearer " + defaultToken)
                    .contentType("application/json")
                    .content("""
                        {
                            "gender": "Male",
                            "dateOfBirth": "1997-01-30",
                            "idCard": "1234567890123495",
                            "name": "Jean Doe 2",
                            "email": "jeandoe2@gmail.com"
                        }
                        """)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(3))
            .andExpect(jsonPath("$.data.userId").value(2))
            .andExpect(jsonPath("$.data.isUser").value("false"))
            .andExpect(jsonPath("$.data.gender").value("Male"))
            .andExpect(jsonPath("$.data.dateOfBirth").value("1997-01-30"))
            .andExpect(jsonPath("$.data.idCard").value("1234567890123495"))
            .andExpect(jsonPath("$.data.name").value("Jean Doe 2"))
            .andExpect(jsonPath("$.data.email").value("jeandoe2@gmail.com"));

        this.mvc.perform(
                get("/api/passenger/%d".formatted(3))
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(3))
            .andExpect(jsonPath("$.data.userId").value(2))
            .andExpect(jsonPath("$.data.isUser").value("false"))
            .andExpect(jsonPath("$.data.gender").value("Male"))
            .andExpect(jsonPath("$.data.dateOfBirth").value("1997-01-30"))
            .andExpect(jsonPath("$.data.idCard").value("1234567890123495"))
            .andExpect(jsonPath("$.data.name").value("Jean Doe 2"))
            .andExpect(jsonPath("$.data.email").value("jeandoe2@gmail.com"));
    }

    @Test
    void shouldSuccessUpdatePassengerEvenIfBodyIsEmpty() throws Exception {
        String responseJson = this.mvc.perform(
                get("/api/passenger/3")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk())
            .andReturn().getResponse().getContentAsString();

        OnePassengerResponse onePassengerResponse = objectMapper.readValue(responseJson, OnePassengerResponse.class);
        ResponseDataPassenger truePassenger = onePassengerResponse.getPassenger();

        this.mvc.perform(
                put("/api/passenger/3")
                    .with(csrf())
                    .header("Authorization", "Bearer " + defaultToken)
                    .contentType("application/json")
                    .content("""
                        {
                        }
                        """)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(truePassenger.getId()))
            .andExpect(jsonPath("$.data.userId").value(truePassenger.getUserId()))
            .andExpect(jsonPath("$.data.isUser").value(truePassenger.getIsUser()))
            .andExpect(jsonPath("$.data.gender").value(truePassenger.getGender().toString()))
            .andExpect(jsonPath("$.data.dateOfBirth").value(truePassenger.getDateOfBirth().toString()))
            .andExpect(jsonPath("$.data.idCard").value(truePassenger.getIdCard()))
            .andExpect(jsonPath("$.data.name").value(truePassenger.getName()))
            .andExpect(jsonPath("$.data.email").value(truePassenger.getEmail()));

        this.mvc.perform(
                get("/api/passenger/%d".formatted(3))
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(truePassenger.getId()))
            .andExpect(jsonPath("$.data.userId").value(truePassenger.getUserId()))
            .andExpect(jsonPath("$.data.isUser").value(truePassenger.getIsUser()))
            .andExpect(jsonPath("$.data.gender").value(truePassenger.getGender().toString()))
            .andExpect(jsonPath("$.data.dateOfBirth").value(truePassenger.getDateOfBirth().toString()))
            .andExpect(jsonPath("$.data.idCard").value(truePassenger.getIdCard()))
            .andExpect(jsonPath("$.data.name").value(truePassenger.getName()))
            .andExpect(jsonPath("$.data.email").value(truePassenger.getEmail()));
    }

    @Test
    void shouldFailedUpdatePassengerWhenPassengerIsOwnedByOtherPeople() throws Exception {
        Passenger passenger = passengerRepository.findById(3L).orElseThrow(() -> new Exception("Passenger is lost"));

        String responseJson = this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "agus",
                            "password": "123456"
                        }
                        """)
            )
            .andReturn().getResponse().getContentAsString();

        LoginResponse userLoginResponse = objectMapper.readValue(responseJson, LoginResponse.class);
        String agusToken = userLoginResponse.getToken();

        this.mvc.perform(
                put("/api/passenger/3")
                    .with(csrf())
                    .header("Authorization", "Bearer " + agusToken)
                    .contentType("application/json")
                    .content("""
                        {
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Not Authorized"));

        this.mvc.perform(
                get("/api/passenger/%d".formatted(3))
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(passenger.getId()))
            .andExpect(jsonPath("$.data.userId").value(passenger.getUser().getId()))
            .andExpect(jsonPath("$.data.isUser").value(passenger.getIsUser()))
            .andExpect(jsonPath("$.data.gender").value(passenger.getGender().toString()))
            .andExpect(jsonPath("$.data.dateOfBirth").value(passenger.getDateOfBirth().toString()))
            .andExpect(jsonPath("$.data.idCard").value(passenger.getIdCard()))
            .andExpect(jsonPath("$.data.name").value(passenger.getName()))
            .andExpect(jsonPath("$.data.email").value(passenger.getEmail()));
    }

    @Test
    @DirtiesContext
    void shouldSuccessDeletePassenger() throws Exception {
        Passenger passenger = passengerRepository.findById(3L).orElseThrow(() -> new Exception("Passenger is lost"));

        this.mvc.perform(
            delete("/api/passenger/3")
                .header("Authorization", "Bearer " + defaultToken)
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Successfully delete %s".formatted(passenger.getName())));

        this.mvc.perform(
                get("/api/passenger/1000")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isNotFound());
    }

    @Test
    void shouldFailedDeletePassengerWhenPassengerIdIsNotFound() throws Exception {
        this.mvc.perform(
                delete("/api/passenger/1000")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Passenger Not Found"));
    }

    @Test
    void shouldFailedDeletePassengerWhenPassengerIsOwnedByOtherUser() throws Exception {
        String responseJson = this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "agus",
                            "password": "123456"
                        }
                        """)
            )
            .andReturn().getResponse().getContentAsString();

        LoginResponse userLoginResponse = objectMapper.readValue(responseJson, LoginResponse.class);
        String agusToken = userLoginResponse.getToken();

        this.mvc.perform(
                delete("/api/passenger/3")
                    .header("Authorization", "Bearer " + agusToken)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Not Authorized"));

        this.mvc.perform(
                get("/api/passenger/3")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk());
    }

    @Test
    void shouldFailedDeletePassengerWhenPassengerIsUser() throws Exception {
        this.mvc.perform(
                delete("/api/passenger/2")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("You cannot delete your data with this endpoint"));

        this.mvc.perform(
                get("/api/passenger/2")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk());
    }
}