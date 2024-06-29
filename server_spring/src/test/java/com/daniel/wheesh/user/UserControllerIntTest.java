package com.daniel.wheesh.user;

import com.daniel.wheesh.TestEmailConfig;
import com.daniel.wheesh.WheeshServerApplication;
import com.daniel.wheesh.config.EmailService;
import com.daniel.wheesh.config.JwtService;
import com.daniel.wheesh.emailtoken.EmailToken;
import com.daniel.wheesh.emailtoken.EmailTokenRepository;
import com.daniel.wheesh.passenger.Gender;
import com.daniel.wheesh.passenger.PassengerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ContextConfiguration(classes = {TestEmailConfig.class})
@ActiveProfiles("test")
@AutoConfigureMockMvc
class UserControllerIntTest {
    @Autowired
    JwtService jwtService;

    @Autowired
    UserDetailsService userDetailsService;

    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private EmailTokenRepository emailTokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailService emailService;

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
    void shouldSuccessLogin() throws Exception {
        String responseJson = this.mvc.perform(
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
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.user.id").exists())
            .andExpect(jsonPath("$.user.username").value("johndoe"))
            .andExpect(jsonPath("$.user.email").exists())
            .andExpect(jsonPath("$.user.role").value("user"))
            .andReturn().getResponse().getContentAsString();

        LoginResponse userLoginResponse = objectMapper.readValue(responseJson, LoginResponse.class);
        UserDetails userDetails = userDetailsService.loadUserByUsername(
            userLoginResponse.getUserResponse().getUsername()
        );

        assertTrue(jwtService.isTokenValid(userLoginResponse.getToken(), userDetails));
    }

    @Test
    void shouldFailedLoginForWrongAttribute() throws Exception {
        String responseJson = this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": "johndoe",
                            "password": "123456"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value("Validation Error"))
            .andExpect(jsonPath("$.message").value("usernameOrEmail should not be empty"))
            .andReturn().getResponse().getContentAsString();
    }

    @Test
    void shouldFailedLoginForWrongUsername() throws Exception {
        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "jamesbond",
                            "password": "123456"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Invalid username/email or password"));
    }

    @Test
    void shouldFailedLoginForWrongPassword() throws Exception {
        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "johndoe",
                            "password": "1234567"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Invalid username/email or password"));
    }

    @Test
    @DirtiesContext
    void shouldSuccessSendEmailTokenWhenActionIsCreate() throws Exception {
        this.mvc.perform(
                post("/api/user/sendEmailToken")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "email": "daniel@gmail.com",
                            "action": "create"
                        }
                        """)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Email sent successfully"));

        EmailToken emailToken =
            emailTokenRepository.findByEmail("daniel@gmail.com").orElseThrow(() -> new RuntimeException("The " +
                "emailToken record is not created")
            );

        // TODO: Add checking send the right email
//        verify(emailService, times(1))
//            .sendTokenForNewEmail("daniel@gmail.com", emailToken.getToken());
    }

    @Test
    @DirtiesContext
    void shouldSuccessSendEmailTokenWhenActionIsUpdate() throws Exception {
        this.mvc.perform(
                post("/api/user/sendEmailToken")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "email": "daniel@gmail.com",
                            "action": "update"
                        }
                        """)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Email sent successfully"));

        EmailToken emailToken =
            emailTokenRepository.findByEmail("daniel@gmail.com").orElseThrow(() -> new RuntimeException("The " +
                "emailToken record is not created")
            );

        // TODO: Add checking send the right email
//        verify(emailService, times(1))
//            .sendTokenForUpdateEmail("daniel@gmail.com", emailToken.getToken());
    }

    @Test
    @DirtiesContext
    void shouldSuccessSendEmailTokenWhenEmailIsSendTwice() throws Exception {
        this.mvc.perform(
                post("/api/user/sendEmailToken")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "email": "daniel@gmail.com",
                            "action": "create"
                        }
                        """)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Email sent successfully"));

        EmailToken emailToken =
            emailTokenRepository.findByEmail("daniel@gmail.com").orElseThrow(() -> new RuntimeException("The " +
                "emailToken record is not created")
            );
        String previousToken = emailToken.getToken();

        this.mvc.perform(
                post("/api/user/sendEmailToken")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "email": "daniel@gmail.com",
                            "action": "create"
                        }
                        """)
            )
            .andExpect(status().isOk());

        EmailToken newEmailToken =
            emailTokenRepository.findByEmail("daniel@gmail.com").orElseThrow(() -> new RuntimeException("The " +
                "emailToken record is not created")
            );
        assertEquals(previousToken, newEmailToken.getToken());
    }

    @Test
    void shouldFailedSendEmailTokenWhenEmailExist() throws Exception {
        this.mvc.perform(
                post("/api/user/sendEmailToken")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "email": "jeandoe@gmail.com",
                            "action": "create"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Email already exist!"));

        assertNull(emailTokenRepository.findByEmail("daniel@gmail.com").orElse(null));
    }

    @Test
    @DirtiesContext
    void shouldSuccessRegister() throws Exception {
        this.mvc.perform(
                post("/api/user/sendEmailToken")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "email": "daniel@gmail.com",
                            "action": "create"
                        }
                        """)
            )
            .andExpect(status().isOk());

        EmailToken emailToken =
            emailTokenRepository.findByEmail("daniel@gmail.com").orElseThrow(() -> new RuntimeException("The " +
                "emailToken record is not created")
            );

        String token = emailToken.getToken();

        String responseJson = this.mvc.perform(
                post("/api/user/register")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": "daniel",
                            "password": "123456",
                            "gender": "Male",
                            "dateOfBirth": "2000-07-19",
                            "idCard": "1207235534253543",
                            "name": "Daniel Riyanto",
                            "email": "daniel@gmail.com",
                            "emailToken": "%s"
                        }
                        """.formatted(token))
            )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.username").value("daniel"))
            .andExpect(jsonPath("$.data.role").value("user"))
            .andExpect(jsonPath("$.data.email").value("daniel@gmail.com"))
            .andExpect(jsonPath("$.data.Passengers.length()").value(1))
            .andExpect(jsonPath("$..Passengers[0].id").exists())
            .andExpect(jsonPath("$..Passengers[0].userId").exists())
            .andExpect(jsonPath("$..Passengers[0].isUser").value(true))
            .andExpect(jsonPath("$..Passengers[0].gender").value(Gender.Male.toString()))
            .andExpect(jsonPath("$..Passengers[0].dateOfBirth").value("2000-07-19"))
            .andExpect(jsonPath("$..Passengers[0].idCard").value("1207235534253543"))
            .andExpect(jsonPath("$..Passengers[0].name").value("Daniel Riyanto"))
            .andExpect(jsonPath("$..Passengers[0].email").value("daniel@gmail.com"))
            .andReturn().getResponse().getContentAsString();

        ProfileResponse profileResponse = objectMapper.readValue(responseJson, ProfileResponse.class);
        assertEquals(profileResponse.getData().getId(),
            profileResponse.getData().getPassengers().getFirst().getUserId());

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "daniel",
                            "password": "123456"
                        }
                        """)
            )
            .andExpect(status().isOk());

        assertNull(emailTokenRepository.findByEmail("daniel@gmail.com").orElse(null));
    }

    @Test
    void shouldFailedRegisterWhenUsernameAlreadyExist() throws Exception {
        this.mvc.perform(
                post("/api/user/register")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": "johndoe",
                            "password": "123456",
                            "gender": "Male",
                            "dateOfBirth": "2000-07-19",
                            "idCard": "1207235534253543",
                            "name": "Daniel Riyanto",
                            "email": "daniel@gmail.com",
                            "emailToken": "111111"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Username already exists!"));

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "daniel@gmail.com",
                            "password": "123456"
                        }
                        """)
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFailedRegisterWhenEmailAlreadyExist() throws Exception {
        this.mvc.perform(
                post("/api/user/register")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": "daniel",
                            "password": "123456",
                            "gender": "Male",
                            "dateOfBirth": "2000-07-19",
                            "idCard": "1207235534253543",
                            "name": "Daniel Riyanto",
                            "email": "johndoe@gmail.com",
                            "emailToken": "111111"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Email already exists!"));

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "daniel",
                            "password": "123456"
                        }
                        """)
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFailedRegisterWhenPasswordIsLessThan6Chars() throws Exception {
        this.mvc.perform(
                post("/api/user/register")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": "daniel",
                            "password": "12345",
                            "gender": "Male",
                            "dateOfBirth": "2000-07-19",
                            "idCard": "1207235534253543",
                            "name": "Daniel Riyanto",
                            "email": "daniel@gmail.com",
                            "emailToken": "111111"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("password must be at least 6 characters long"));

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "daniel",
                            "password": "12345"
                        }
                        """)
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFailedRegisterWhenGenderIsNotBinary() throws Exception {
        this.mvc.perform(
                post("/api/user/register")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": "daniel",
                            "password": "123456",
                            "gender": "Non-Binary",
                            "dateOfBirth": "2000-07-19",
                            "idCard": "1207235534253543",
                            "name": "Daniel Riyanto",
                            "email": "daniel@gmail.com",
                            "emailToken": "111111"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Gender can only be Male or Female"));

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "daniel",
                            "password": "123456"
                        }
                        """)
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFailedRegisterWhenUserIsNotOldEnough() throws Exception {
        LocalDate tenYearsAgo = LocalDate.now().minusYears(10);
        String dateOfBirth = tenYearsAgo.toString();

        this.mvc.perform(
                post("/api/user/register")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": "daniel",
                            "password": "123456",
                            "gender": "Male",
                            "dateOfBirth": "%s",
                            "idCard": "1207235534253543",
                            "name": "Daniel Riyanto",
                            "email": "daniel@gmail.com",
                            "emailToken": "111111"
                        }
                        """.formatted(dateOfBirth))
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("You should be at least 17 years old"));

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "daniel",
                            "password": "123456"
                        }
                        """)
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFailedRegisterWhenIdCardFormatIsIncorrect() throws Exception {
        this.mvc.perform(
                post("/api/user/register")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": "daniel",
                            "password": "123456",
                            "gender": "Male",
                            "dateOfBirth": "2000-07-19",
                            "idCard": "120723553425354",
                            "name": "Daniel Riyanto",
                            "email": "daniel@gmail.com",
                            "emailToken": "111111"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("ID Card is in invalid format"));

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "daniel",
                            "password": "123456"
                        }
                        """)
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldFailedRegisterWhenEmailFormatIsIncorrect() throws Exception {
        this.mvc.perform(
                post("/api/user/register")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": "daniel",
                            "password": "123456",
                            "gender": "Male",
                            "dateOfBirth": "2000-07-19",
                            "idCard": "1207235534253543",
                            "name": "Daniel Riyanto",
                            "email": "danielgmail",
                            "emailToken": "111111"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("email is not in correct format"));

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "daniel",
                            "password": "123456"
                        }
                        """)
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldSuccessGetProfile() throws Exception {
        String responseJson = this.mvc.perform(
                get("/api/user")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.username").value("johndoe"))
            .andExpect(jsonPath("$.data.role").value("user"))
            .andExpect(jsonPath("$.data.email").value("johndoe@gmail.com"))
            .andExpect(jsonPath("$.data.Passengers.length()").value(1))
            .andExpect(jsonPath("$..Passengers[0].id").exists())
            .andExpect(jsonPath("$..Passengers[0].userId").exists())
            .andExpect(jsonPath("$..Passengers[0].isUser").value(true))
            .andExpect(jsonPath("$..Passengers[0].gender").value(Gender.Male.toString()))
            .andExpect(jsonPath("$..Passengers[0].dateOfBirth").exists())
            .andExpect(jsonPath("$..Passengers[0].idCard").exists())
            .andExpect(jsonPath("$..Passengers[0].name").exists())
            .andExpect(jsonPath("$..Passengers[0].email").value("johndoe@gmail.com"))
            .andReturn().getResponse().getContentAsString();

        ProfileResponse profileResponse = objectMapper.readValue(responseJson, ProfileResponse.class);
        assertEquals(profileResponse.getData().getId(),
            profileResponse.getData().getPassengers().getFirst().getUserId());
    }

    @Test
    @DirtiesContext
    void shouldSuccessUpdateProfile() throws Exception {
        this.mvc.perform(
                put("/api/user")
                    .header("Authorization", "Bearer " + defaultToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": "johndoe2",
                            "gender": "Female",
                            "dateOfBirth": "2000-07-18",
                            "idCard": "1234876590123456",
                            "name": "John Doe 2"
                        }
                        """)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(2))
            .andExpect(jsonPath("$.data.username").value("johndoe2"))
            .andExpect(jsonPath("$.data.email").value("johndoe@gmail.com"))
            .andExpect(jsonPath("$.data.role").value("user"));

        this.mvc.perform(
                get("/api/user")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(2))
            .andExpect(jsonPath("$.data.username").value("johndoe2"))
            .andExpect(jsonPath("$.data.role").value("user"))
            .andExpect(jsonPath("$.data.email").value("johndoe@gmail.com"))
            .andExpect(jsonPath("$..Passengers[0].isUser").value(true))
            .andExpect(jsonPath("$..Passengers[0].gender").value(Gender.Female.toString()))
            .andExpect(jsonPath("$..Passengers[0].dateOfBirth").value("2000-07-18"))
            .andExpect(jsonPath("$..Passengers[0].idCard").value("1234876590123456"))
            .andExpect(jsonPath("$..Passengers[0].name").value("John Doe 2"))
            .andExpect(jsonPath("$..Passengers[0].email").value("johndoe@gmail.com"));
    }

    @Test
    void shouldFailedUpdateProfileWhenIdCardFormatIsWrong() throws Exception {
        this.mvc.perform(
                put("/api/user")
                    .header("Authorization", "Bearer " + defaultToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "idCard": "123487659012345",
                            "name": "John Doe 2"
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("ID Card is in invalid format"));

        this.mvc.perform(
                get("/api/user")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(2))
            .andExpect(jsonPath("$.data.username").value("johndoe"))
            .andExpect(jsonPath("$.data.role").value("user"))
            .andExpect(jsonPath("$.data.email").value("johndoe@gmail.com"))
            .andExpect(jsonPath("$..Passengers[0].isUser").value(true))
            .andExpect(jsonPath("$..Passengers[0].gender").value(Gender.Male.toString()))
            .andExpect(jsonPath("$..Passengers[0].dateOfBirth").value("1995-10-12"))
            .andExpect(jsonPath("$..Passengers[0].idCard").value("1234567890123456"))
            .andExpect(jsonPath("$..Passengers[0].name").value("John Doe"))
            .andExpect(jsonPath("$..Passengers[0].email").value("johndoe@gmail.com"));
    }

    @Test
    void shouldFailedUpdateProfileWhenUsernameIsBlank() throws Exception {
        this.mvc.perform(
                put("/api/user")
                    .header("Authorization", "Bearer " + defaultToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "username": ""
                        }
                        """)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Username can be null but not blank"));

        this.mvc.perform(
                get("/api/user")
                    .header("Authorization", "Bearer " + defaultToken)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(2))
            .andExpect(jsonPath("$.data.username").value("johndoe"))
            .andExpect(jsonPath("$.data.role").value("user"))
            .andExpect(jsonPath("$.data.email").value("johndoe@gmail.com"))
            .andExpect(jsonPath("$..Passengers[0].isUser").value(true))
            .andExpect(jsonPath("$..Passengers[0].gender").value(Gender.Male.toString()))
            .andExpect(jsonPath("$..Passengers[0].dateOfBirth").value("1995-10-12"))
            .andExpect(jsonPath("$..Passengers[0].idCard").value("1234567890123456"))
            .andExpect(jsonPath("$..Passengers[0].name").value("John Doe"))
            .andExpect(jsonPath("$..Passengers[0].email").value("johndoe@gmail.com"));
    }

    @Test
    @DirtiesContext
    void shouldSuccessChangePassword() throws Exception {
        this.mvc.perform(
                put("/api/user/changePassword")
                    .header("Authorization", "Bearer " + defaultToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "oldPassword": "123456",
                            "newPassword": "daniel"
                        }
                        """)

            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Change password successfully"));

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "johndoe",
                            "password": "daniel"
                        }
                        """)
            )
            .andExpect(status().isOk());
    }

    @Test
    @DirtiesContext
    void shouldFailedChangePasswordWhenOldPasswordIsWrong() throws Exception {
        this.mvc.perform(
                put("/api/user/changePassword")
                    .header("Authorization", "Bearer " + defaultToken)
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "oldPassword": "1234567",
                            "newPassword": "daniel"
                        }
                        """)

            )
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Invalid old password"));

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "johndoe",
                            "password": "daniel"
                        }
                        """)
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    void shouldSuccessVerifyToken() throws Exception {
        this.mvc.perform(
                post("/api/user/verifyToken")
                    .header("Authorization", "Bearer " + defaultToken)
                    .with(csrf())
            )
            .andExpect(status().isOk());
    }

    @Test
    void shouldFailedVerifyTokenWhenTokenIsInvalid() throws Exception {
        this.mvc.perform(
                post("/api/user/verifyToken")
                    .header("Authorization", "Bearer " + "lolololo")
                    .with(csrf())
            )
            .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldSuccessChangeEmail() throws Exception {
        this.mvc.perform(
                post("/api/user/sendEmailToken")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "email": "daniel@gmail.com",
                            "action": "update"
                        }
                        """)
            )
            .andExpect(status().isOk());

        EmailToken emailToken =
            emailTokenRepository.findByEmail("daniel@gmail.com").orElseThrow(() -> new RuntimeException("The " +
                "emailToken record is not created")
            );
        String token = emailToken.getToken();

        this.mvc.perform(
            put("/api/user/changeEmail")
                .header("Authorization", "Bearer " + defaultToken)
                .with(csrf())
                .contentType("application/json")
                .content("""
                    {
                        "email": "daniel@gmail.com",
                        "emailToken": "%s"
                    }
                    """.formatted(token))
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.username").value("johndoe"))
            .andExpect(jsonPath("$.data.email").value("daniel@gmail.com"))
            .andExpect(jsonPath("$.data.role").value("user"));

        this.mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "daniel@gmail.com",
                            "password": "123456"
                        }
                        """)
            )
            .andExpect(status().isOk());

        assertNull(emailTokenRepository.findByEmail("daniel@gmail.com").orElse(null));
        assertNotNull(passengerRepository.findByEmail("daniel@gmail.com").orElse(null));
    }
}