package com.daniel.wheesh.schedule;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class ScheduleControllerIntTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ScheduleRepository scheduleRepository;

    private final ZoneId jakartaZone = ZoneId.of("Asia/Jakarta");

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Test
    void shouldSuccessGetLatestDateSchedule() throws Exception {
        Schedule schedule = scheduleRepository.findLatestSchedule().orElseThrow();
        String responseJson = mvc.perform(
                get("/api/schedule/latestDate")
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andReturn().getResponse().getContentAsString();

        LatestDateResponse latestDateResponse = objectMapper.readValue(responseJson, LatestDateResponse.class);
        assertEquals(schedule.getDepartureTime(), latestDateResponse.getLatestDate());
    }

    @Test
    void shouldSuccessGetSchedules() throws Exception {
        String responseJson = mvc.perform(
                get("/api/schedule/1/3/%s".formatted(ZonedDateTime.now(jakartaZone).plusDays(1).format(formatter)))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data[0].id").isNumber())
            .andExpect(jsonPath("$..Train").exists())
            .andExpect(jsonPath("$.data[0].Train.id").isNumber())
            .andExpect(jsonPath("$.data[0].Train.name").isString())
            .andExpect(jsonPath("$..departureStation").exists())
            .andExpect(jsonPath("$.data[0].departureStation.id").value(1))
            .andExpect(jsonPath("$.data[0].departureStation.name").isString())
            .andExpect(jsonPath("$..arrivalStation").exists())
            .andExpect(jsonPath("$.data[0].arrivalStation.id").value(3))
            .andExpect(jsonPath("$.data[0].arrivalStation.name").isString())
            .andExpect(jsonPath("$.data[0].departureTime").isString())
            .andExpect(jsonPath("$.data[0].arrivalTime").isString())
            .andExpect(jsonPath("$.data[0].firstSeatAvailable").isString())
            .andExpect(jsonPath("$.data[0].businessSeatAvailable").isString())
            .andExpect(jsonPath("$.data[0].economySeatAvailable").isString())
            .andExpect(jsonPath("$..prices").exists())
            .andExpect(jsonPath("$.data[0].prices.length()").value(3))
            .andExpect(jsonPath("$.data[0].prices[0].id").isNumber())
            .andExpect(jsonPath("$.data[0].prices[0].seatClass").isString())
            .andExpect(jsonPath("$.data[0].prices[0].price").isNumber())
            .andReturn().getResponse().getContentAsString();

        SchedulesResponse schedulesResponse = objectMapper.readValue(responseJson, SchedulesResponse.class);
        ZonedDateTime todayJakarta = ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime localJakarta = todayJakarta.toLocalDateTime();

        assertTrue(schedulesResponse.getSchedules().getFirst().getDepartureTime().isAfter(localJakarta.plusDays(1)));
        assertTrue(schedulesResponse.getSchedules().getFirst().getDepartureTime().isBefore(localJakarta.plusDays(2)));

        assertTrue(schedulesResponse.getSchedules().getLast().getDepartureTime().isAfter(localJakarta.plusDays(1)));
        assertTrue(schedulesResponse.getSchedules().getLast().getDepartureTime().isBefore(localJakarta.plusDays(2)));
    }

    @Test
    @Transactional
    void shouldSuccessGetOneSchedule() throws Exception {
        ZonedDateTime todayJakarta = ZonedDateTime.now(jakartaZone).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime localJakarta = todayJakarta.toLocalDateTime();

        List<Schedule> scheduleList = scheduleRepository.findAfterLocalDateTimeWithTrainAndStations(
            localJakarta.plusDays(1)
        );
        Schedule schedule = scheduleList.get(1); // get tomorrow second schedule

        mvc.perform(
                get("/api/schedule/%d".formatted(schedule.getId()))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data").exists())
            .andExpect(jsonPath("$.data.id").value(schedule.getId()))
            .andExpect(jsonPath("$..Train").exists())
            .andExpect(jsonPath("$..Train.id").value(schedule.getTrain().getId().intValue()))
            .andExpect(jsonPath("$..Train.name").value(schedule.getTrain().getName()))
            .andExpect(jsonPath("$..departureStation").exists())
            .andExpect(jsonPath("$..departureStation.id").value(schedule.getDepartureStation().getId().intValue()))
            .andExpect(jsonPath("$..departureStation.name").value(schedule.getDepartureStation().getName()))
            .andExpect(jsonPath("$..arrivalStation").exists())
            .andExpect(jsonPath("$..arrivalStation.id").value(schedule.getArrivalStation().getId().intValue()))
            .andExpect(jsonPath("$..arrivalStation.name").value(schedule.getArrivalStation().getName()))
            .andExpect(jsonPath("$.data.departureTime").isString())
            .andExpect(jsonPath("$.data.arrivalTime").isString())
            .andExpect(jsonPath("$.data.firstSeatAvailable").isString())
            .andExpect(jsonPath("$.data.businessSeatAvailable").isString())
            .andExpect(jsonPath("$.data.economySeatAvailable").isString())
            .andExpect(jsonPath("$.data.firstSeatRemainder").isNumber())
            .andExpect(jsonPath("$.data.businessSeatRemainder").isNumber())
            .andExpect(jsonPath("$.data.economySeatRemainder").isNumber())
            .andExpect(jsonPath("$..prices").exists())
            .andExpect(jsonPath("$..prices.length()").value(3))
            .andExpect(jsonPath("$.data.prices[0].id").isNumber())
            .andExpect(jsonPath("$.data.prices[0].seatClass").isString())
            .andExpect(jsonPath("$.data.prices[0].price").isNumber())
            .andExpect(jsonPath("$..carriages").exists())
            .andExpect(jsonPath("$.data.carriages[0].id").isNumber())
            .andExpect(jsonPath("$.data.carriages[0].carriageNumber").isNumber())
            .andExpect(jsonPath("$..carriages[0].Seats").exists())
            .andExpect(jsonPath("$.data.carriages[0].Seats[0].id").isNumber())
            .andExpect(jsonPath("$.data.carriages[0].Seats[0].seatNumber").isString())
            .andExpect(jsonPath("$.data.carriages[0].Seats[0].seatClass").isString())
            .andExpect(jsonPath("$.data.carriages[0].Seats[0].isBooked").isBoolean());
    }
}