package com.daniel.wheesh.banner;

import com.daniel.wheesh.passenger.PassengerSeeder;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class BannerSeeder {
    private static final Logger logger = LoggerFactory.getLogger(BannerSeeder.class);

    private final BannerRepository bannerRepository;

    public void seedBanners() throws Exception {
        if (bannerRepository.count() == 0) {
            logger.info("No banners found in the database. Seeding initial data.");

            Banner[] banners = new Banner[]{
                Banner.builder()
                    .imageDesktop("public/Frame 1 - Desktop.png")
                    .imageMobile("public/Frame 1 - Mobile.png")
                    .build(),
                Banner.builder()
                    .imageDesktop("public/Frame 2 - Desktop.png")
                    .imageMobile("public/Frame 2 - Mobile.png")
                    .build(),
                Banner.builder()
                    .imageDesktop("public/Frame 3 - Desktop.png")
                    .imageMobile("public/Frame 3 - Mobile.png")
                    .build(),
                Banner.builder()
                    .imageDesktop("public/Frame 4 - Desktop.png")
                    .imageMobile("public/Frame 4 - Mobile.png")
                    .build(),
                Banner.builder()
                    .imageDesktop("public/Frame 5 - Desktop.png")
                    .imageMobile("public/Frame 5 - Mobile.png")
                    .build(),
            };
            bannerRepository.saveAll(Arrays.asList(banners));

            logger.info("Seeded initial banners data");
        } else {
            logger.info("Banners already exist in the database. No seeding needed.");
        }
    }

    public void unseedBanners() {
        logger.info("Deleting all banners data.");
        bannerRepository.deleteAll();
        logger.info("All banners data deleted.");
    }
}
