package com.daniel.wheesh.banner;

import com.daniel.wheesh.user.LoginResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class BannerControllerIntTest {
    @Autowired
    ObjectMapper objectMapper;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private BannerRepository bannerRepository;

    @SpyBean
    private BannerController bannerController;

    @SpyBean
    private BannerService bannerService;

    private static String adminToken;

    private static String userToken;

    @BeforeAll
    static void beforeAll(@Autowired MockMvc mvc, @Autowired ObjectMapper objectMapper) throws Exception {
        String responseJson = mvc.perform(
                post("/api/user/login")
                    .with(csrf())
                    .contentType("application/json")
                    .content("""
                        {
                            "usernameOrEmail": "bangjoe",
                            "password": "123456"
                        }
                        """)
            )
            .andReturn().getResponse().getContentAsString();

        LoginResponse adminLoginResponse = objectMapper.readValue(responseJson, LoginResponse.class);
        adminToken = adminLoginResponse.getToken();

        responseJson = mvc.perform(
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
        userToken = userLoginResponse.getToken();
    }

    @BeforeEach
    public void setup() {
        // Mock the isImageNotValid method to always return false
        doReturn(false).when(bannerController).isImageNotValid(any(MultipartFile.class));
    }

    @Test
    void shouldSuccessGetBanners() throws Exception {
        this.mvc.perform(
                get("/api/banner")
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data[0].id").exists())
            .andExpect(jsonPath("$.data[0].imageDesktop").exists())
            .andExpect(jsonPath("$.data[0].imageMobile").exists());
    }

    @Test
    void shouldSuccessGetOneBanner() throws Exception {
        this.mvc.perform(
                get("/api/banner/1")
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.imageDesktop").exists())
            .andExpect(jsonPath("$.data.imageMobile").exists());
    }

    @Test
    void shouldFailedGetOneBannerWhenBannerIdIsNotFound() throws Exception {
        this.mvc.perform(
                get("/api/banner/1000")
            )
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Banner Not Found"));
    }

    @Test
    @DirtiesContext
    void shouldSuccessCreateBanner() throws Exception {
        MockMultipartFile imageDesktop = new MockMultipartFile("imageDesktop", "desktop.jpg", "image/jpeg", ("desktop " +
            "image content").getBytes());
        MockMultipartFile imageMobile = new MockMultipartFile("imageMobile", "mobile.jpg", "image/jpeg", ("mobile " +
            "image content").getBytes());

        doReturn("desktop.jpg").when(bannerService).storeFile(imageDesktop);
        doReturn("mobile.jpg").when(bannerService).storeFile(imageMobile);

        String responseJson = this.mvc.perform(
            multipart("/api/banner")
                .file(imageDesktop)
                .file(imageMobile)
                .with(csrf())
                .header("Authorization", "Bearer " + adminToken)
        )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.imageDesktop").exists())
            .andExpect(jsonPath("$.data.imageMobile").exists())
            .andReturn().getResponse().getContentAsString();

        OneBannerResponse bannerResponse = objectMapper.readValue(responseJson, OneBannerResponse.class);
        Long bannerId = bannerResponse.getBanner().getId();

        this.mvc.perform(
                get("/api/banner/%d".formatted(bannerId))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.imageDesktop").value("desktop.jpg"))
            .andExpect(jsonPath("$.data.imageMobile").value("mobile.jpg"));
    }

    @Test
    void shouldFailedCreateBannerWhenUserIsNotAdmin() throws Exception {
        Long previousCount = bannerRepository.count();

        MockMultipartFile imageDesktop = new MockMultipartFile("imageDesktop", "desktop.jpg", "image/jpeg", ("desktop " +
            "image content").getBytes());
        MockMultipartFile imageMobile = new MockMultipartFile("imageMobile", "mobile.jpg", "image/jpeg", ("mobile " +
            "image content").getBytes());

        this.mvc.perform(
                multipart("/api/banner")
                    .file(imageDesktop)
                    .file(imageMobile)
                    .with(csrf())
                    .header("Authorization", "Bearer " + userToken)
            )
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Not Authorized"));

        assertEquals(previousCount, bannerRepository.count());
    }

    @Test
    @DirtiesContext
    void shouldSuccessUpdateBanner() throws Exception {
        MockMultipartFile imageDesktop = new MockMultipartFile("imageDesktop", "desktop.jpg", "image/jpeg", ("desktop " +
            "image content").getBytes());
        MockMultipartFile imageMobile = new MockMultipartFile("imageMobile", "mobile.jpg", "image/jpeg", ("mobile " +
            "image content").getBytes());

        doReturn("desktop.jpg").when(bannerService).storeFile(imageDesktop);
        doReturn("mobile.jpg").when(bannerService).storeFile(imageMobile);
        doNothing().when(bannerService).deleteFile(any(String.class));

        this.mvc.perform(
                multipart("/api/banner/1")
                    .file(imageDesktop)
                    .file(imageMobile)
                    .with(csrf())
                    .header("Authorization", "Bearer " + adminToken)
                    .with(request -> {
                        request.setMethod("PUT");
                        return request;
                    })
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.imageDesktop").value("desktop.jpg"))
            .andExpect(jsonPath("$.data.imageMobile").value("mobile.jpg"));

        this.mvc.perform(
                get("/api/banner/1")
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.imageDesktop").value("desktop.jpg"))
            .andExpect(jsonPath("$.data.imageMobile").value("mobile.jpg"));
    }

    @Test
    void shouldFailedUpdateBannerWhenUserIsNotAdmin() throws Exception {
        Banner banner = bannerRepository.findById(1L).orElseThrow(() -> new Exception("Banner is lost"));

        MockMultipartFile imageDesktop = new MockMultipartFile("imageDesktop", "desktop.jpg", "image/jpeg", ("desktop " +
            "image content").getBytes());
        MockMultipartFile imageMobile = new MockMultipartFile("imageMobile", "mobile.jpg", "image/jpeg", ("mobile " +
            "image content").getBytes());

        this.mvc.perform(
                multipart("/api/banner/1")
                    .file(imageDesktop)
                    .file(imageMobile)
                    .with(csrf())
                    .header("Authorization", "Bearer " + userToken)
                    .with(request -> {
                        request.setMethod("PUT");
                        return request;
                    })
            )
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Not Authorized"));

        this.mvc.perform(
                get("/api/banner/1")
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").exists())
            .andExpect(jsonPath("$.data.imageDesktop").value(banner.getImageDesktop()))
            .andExpect(jsonPath("$.data.imageMobile").value(banner.getImageMobile()));
    }

    @Test
    void shouldFailedUpdateBannerWhenBannerIdIsNotFound() throws Exception {
        MockMultipartFile imageDesktop = new MockMultipartFile("imageDesktop", "desktop.jpg", "image/jpeg", ("desktop " +
            "image content").getBytes());
        MockMultipartFile imageMobile = new MockMultipartFile("imageMobile", "mobile.jpg", "image/jpeg", ("mobile " +
            "image content").getBytes());

        this.mvc.perform(
                multipart("/api/banner/1000")
                    .file(imageDesktop)
                    .file(imageMobile)
                    .with(csrf())
                    .header("Authorization", "Bearer " + adminToken)
                    .with(request -> {
                        request.setMethod("PUT");
                        return request;
                    })
            )
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.data").doesNotExist())
            .andExpect(jsonPath("$.message").value("Banner Not Found"));
    }

    @Test
    @DirtiesContext
    void shouldSuccessDeleteBanner() throws Exception {
        doNothing().when(bannerService).deleteFile(any(String.class));

        this.mvc.perform(
            delete("/api/banner/1")
                .with(csrf())
                .header("Authorization", "Bearer " + adminToken)
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Banner deleted successfully"));

        this.mvc.perform(
            get("/api/banner/1")
        )
            .andExpect(status().isNotFound());
    }

    @Test
    void shouldFailedDeleteBannerWhenBannerIsNotFound() throws Exception {
        this.mvc.perform(
                delete("/api/banner/1000")
                    .with(csrf())
                    .header("Authorization", "Bearer " + adminToken)
            )
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("Banner Not Found"));
    }

    @Test
    @DirtiesContext
    void shouldFailedDeleteBannerWhenBannersCountIsOnlyOne() throws Exception {
        MockMultipartFile imageDesktop = new MockMultipartFile("imageDesktop", "desktop.jpg", "image/jpeg", ("desktop " +
            "image content").getBytes());
        MockMultipartFile imageMobile = new MockMultipartFile("imageMobile", "mobile.jpg", "image/jpeg", ("mobile " +
            "image content").getBytes());

        doReturn("desktop.jpg").when(bannerService).storeFile(imageDesktop);
        doReturn("mobile.jpg").when(bannerService).storeFile(imageMobile);

        bannerRepository.deleteAll();
        Banner banner = Banner.builder()
            .imageDesktop("public/Desktop 1.jpg")
            .imageMobile("public/Mobile 1.jpg")
            .build();
        bannerRepository.save(banner);

        this.mvc.perform(
                delete("/api/banner/%d".formatted(banner.getId()))
                    .with(csrf())
                    .header("Authorization", "Bearer " + adminToken)
            )
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Should have minimum 1 banner"));

        this.mvc.perform(
                get("/api/banner/%d".formatted(banner.getId()))
                    .with(csrf())
                    .header("Authorization", "Bearer " + adminToken)
            )
            .andExpect(status().isOk());
    }
}