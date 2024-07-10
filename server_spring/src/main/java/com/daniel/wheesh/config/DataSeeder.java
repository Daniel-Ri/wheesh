package com.daniel.wheesh.config;

import com.daniel.wheesh.banner.BannerSeeder;
import com.daniel.wheesh.carriage.CarriageSeeder;
import com.daniel.wheesh.order.OrderSeeder;
import com.daniel.wheesh.orderedseat.OrderedSeatSeeder;
import com.daniel.wheesh.passenger.PassengerSeeder;
import com.daniel.wheesh.payment.PaymentSeeder;
import com.daniel.wheesh.schedule.ScheduleSeeder;
import com.daniel.wheesh.scheduleday.ScheduleDaySeeder;
import com.daniel.wheesh.scheduleprice.SchedulePriceSeeder;
import com.daniel.wheesh.seat.SeatSeeder;
import com.daniel.wheesh.station.StationSeeder;
import com.daniel.wheesh.train.TrainSeeder;
import com.daniel.wheesh.user.UserSeeder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder {
    private final UserSeeder userSeeder;
    private final PassengerSeeder passengerSeeder;
    private final StationSeeder stationSeeder;
    private final ScheduleDaySeeder scheduleDaySeeder;
    private final TrainSeeder trainSeeder;
    private final ScheduleSeeder scheduleSeeder;
    private final SchedulePriceSeeder schedulePriceSeeder;
    private final CarriageSeeder carriageSeeder;
    private final SeatSeeder seatSeeder;
    private final OrderSeeder orderSeeder;
    private final OrderedSeatSeeder orderedSeatSeeder;
    private final PaymentSeeder paymentSeeder;
    private final BannerSeeder bannerSeeder;

    public void seed() throws Exception {
        userSeeder.seedUsers();
        passengerSeeder.seedPassengers();
        stationSeeder.seedStations();
        scheduleDaySeeder.seed();
        trainSeeder.seed();
        scheduleSeeder.seed();
        schedulePriceSeeder.seed();
        carriageSeeder.seed();
        seatSeeder.seed();
        orderSeeder.seed();
        orderedSeatSeeder.seed();
        paymentSeeder.seed();
        bannerSeeder.seedBanners();
    }
}
