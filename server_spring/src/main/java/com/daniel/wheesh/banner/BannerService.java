package com.daniel.wheesh.banner;

import com.daniel.wheesh.global.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {
    private final BannerRepository bannerRepository;

    private final String IMAGES_DIR = "src/main/resources/images";

    public BannersResponse getBanners() {
        List<Banner> banners = bannerRepository.findAll();

        List<ResponseDataBanner> responseDataBanners = banners.stream()
            .map(banner -> ResponseDataBanner.builder()
                .id(banner.getId())
                .imageDesktop(banner.getImageDesktop())
                .imageMobile(banner.getImageMobile())
                .build())
            .toList();

        return BannersResponse.builder()
            .banners(responseDataBanners)
            .build();
    }

    public OneBannerResponse getOneBanner(Long bannerId) {
        Banner banner = bannerRepository.findById(bannerId).orElseThrow(() -> new CustomException(
            "Banner Not Found", HttpStatus.NOT_FOUND));

        return OneBannerResponse.builder()
            .banner(ResponseDataBanner.builder()
                .id(banner.getId())
                .imageDesktop(banner.getImageDesktop())
                .imageMobile(banner.getImageMobile())
                .build())
            .build();
    }

    public OneBannerResponse createBanner(MultipartFile imageDesktop, MultipartFile imageMobile) throws IOException {
        String desktopFileName = storeFile(imageDesktop);
        String mobileFileName = storeFile(imageMobile);

        Banner banner = Banner.builder()
            .imageDesktop(desktopFileName)
            .imageMobile(mobileFileName)
            .build();
        bannerRepository.save(banner);

        return OneBannerResponse.builder()
            .banner(ResponseDataBanner.builder()
                .id(banner.getId())
                .imageDesktop(banner.getImageDesktop())
                .imageMobile(banner.getImageMobile())
                .build()
            )
            .build();
    }

    String storeFile(MultipartFile file) throws IOException {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileName = originalFileName.substring(0, originalFileName.lastIndexOf('.'))
            + "_" + System.currentTimeMillis()
            + originalFileName.substring(originalFileName.lastIndexOf('.'));

        Path uploadPath = Paths.get(IMAGES_DIR);

        Path filePath = uploadPath.resolve(fileName).normalize();
        Files.copy(file.getInputStream(), filePath);

        return fileName;
    }

    public OneBannerResponse updateBanner(MultipartFile imageDesktop, MultipartFile imageMobile, Long bannerId) throws IOException {
        Banner banner = bannerRepository.findById(bannerId).orElseThrow(() -> new CustomException("Banner Not Found",
            HttpStatus.NOT_FOUND)
        );

        String oldDesktopFileName = banner.getImageDesktop();
        String oldMobileFileName = banner.getImageMobile();

        String desktopFileName = storeFile(imageDesktop);
        String mobileFileName = storeFile(imageMobile);

        banner.setImageDesktop(desktopFileName);
        banner.setImageMobile(mobileFileName);
        bannerRepository.save(banner);

        deleteFile(oldDesktopFileName);
        deleteFile(oldMobileFileName);

        return OneBannerResponse.builder()
            .banner(ResponseDataBanner.builder()
                .id(banner.getId())
                .imageDesktop(banner.getImageDesktop())
                .imageMobile(banner.getImageMobile())
                .build()
            )
            .build();
    }

    void deleteFile(String filePath) throws IOException {
        // Extract the file name from the parameter
        String fileName = Paths.get(filePath).getFileName().toString();

        // Construct the full path to the file in the IMAGES_DIR
        Path uploadPath = Paths.get(IMAGES_DIR);
        Path fileToDeletePath = uploadPath.resolve(fileName).normalize();

        // Delete the file if it exists
        Files.deleteIfExists(fileToDeletePath);
    }

    public DeleteBannerResponse deleteBanner(Long bannerId) throws IOException {
        Banner banner = bannerRepository.findById(bannerId).orElseThrow(() -> new CustomException("Banner Not Found",
            HttpStatus.NOT_FOUND)
        );

        long count = bannerRepository.count();
        if (count == 1) {
            throw new CustomException("Should have minimum 1 banner", HttpStatus.BAD_REQUEST);
        }

        bannerRepository.deleteById(bannerId);
        deleteFile(banner.getImageDesktop());
        deleteFile(banner.getImageMobile());

        return new DeleteBannerResponse();
    }
}
