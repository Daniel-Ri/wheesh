package com.daniel.wheesh.config;

import com.daniel.wheesh.banner.BannerSeeder;
import com.daniel.wheesh.carriage.CarriageSeeder;
import com.daniel.wheesh.passenger.PassengerSeeder;
import com.daniel.wheesh.schedule.ScheduleSeeder;
import com.daniel.wheesh.scheduleday.ScheduleDaySeeder;
import com.daniel.wheesh.scheduleprice.SchedulePriceSeeder;
import com.daniel.wheesh.seat.SeatSeeder;
import com.daniel.wheesh.station.StationSeeder;
import com.daniel.wheesh.train.TrainSeeder;
import com.daniel.wheesh.user.UserSeeder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Profile({"default", "test"})
public class RunDataLoader implements CommandLineRunner {
    private final DataSeeder seeder;

    @Override
    public void run(String... args) throws Exception {
        seeder.seed();
    }
}
