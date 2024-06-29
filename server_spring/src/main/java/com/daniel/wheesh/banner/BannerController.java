package com.daniel.wheesh.banner;

import com.daniel.wheesh.global.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/banner")
public class BannerController {
    private final BannerService service;

    @GetMapping
    private ResponseEntity<BannersResponse> getBanners() {
        return ResponseEntity.ok(service.getBanners());
    }

    @GetMapping("/{bannerId}")
    private ResponseEntity<OneBannerResponse> getOneBanner(@PathVariable("bannerId") Long bannerId) {
        return ResponseEntity.ok(service.getOneBanner(bannerId));
    }

    @PostMapping
    private ResponseEntity<OneBannerResponse> createBanner(
        @RequestParam("imageDesktop") MultipartFile imageDesktop,
        @RequestParam("imageMobile") MultipartFile imageMobile
    ) throws IOException {

        if (imageDesktop.isEmpty() || imageMobile.isEmpty()) {
            throw new CustomException("Image files must not be empty", HttpStatus.BAD_REQUEST);
        }

        if (isImageNotValid(imageDesktop) || isImageNotValid(imageMobile)) {
            throw new CustomException("Uploaded files are not valid images", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(service.createBanner(imageDesktop, imageMobile));
    }

    @PutMapping("/{bannerId}")
    private ResponseEntity<OneBannerResponse> updateBanner(
        @RequestParam("imageDesktop") MultipartFile imageDesktop,
        @RequestParam("imageMobile") MultipartFile imageMobile,
        @PathVariable("bannerId") Long bannerId
    ) throws IOException {
        if (imageDesktop.isEmpty() || imageMobile.isEmpty()) {
            throw new CustomException("Image files must not be empty", HttpStatus.BAD_REQUEST);
        }

        if (isImageNotValid(imageDesktop) || isImageNotValid(imageMobile)) {
            throw new CustomException("Uploaded files are not valid images", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok(service.updateBanner(imageDesktop, imageMobile, bannerId));
    }

    boolean isImageNotValid(MultipartFile file) {
        if (!file.getContentType().startsWith("image")) {
            return true;
        }

        try {
            BufferedImage image = ImageIO.read(file.getInputStream());
            return image == null;
        } catch (IOException e) {
            e.printStackTrace();
            return true;
        }
    }

    @DeleteMapping("/{bannerId}")
    private ResponseEntity<DeleteBannerResponse> deleteBanner(
        @PathVariable("bannerId") Long bannerId
    ) throws IOException {
        return ResponseEntity.ok(service.deleteBanner(bannerId));
    }
}
