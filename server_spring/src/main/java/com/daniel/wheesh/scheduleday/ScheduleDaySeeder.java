package com.daniel.wheesh.scheduleday;

import com.daniel.wheesh.station.StationRepository;
import com.daniel.wheesh.station.StationSeeder;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ScheduleDaySeeder {
    private static final Logger logger = LoggerFactory.getLogger(StationSeeder.class);

    private final ScheduleDayRepository scheduleDayRepository;

    private final StationRepository stationRepository;

    private final ObjectMapper mapper;

    public void seed() throws IOException, ParseException {
        if (scheduleDayRepository.count() == 0) {
            logger.info("No scheduleDays found in the database. Seeding initial data.");

            List<ScheduleDay> scheduleDayList = new ArrayList<>();
            TypeReference<List<ScheduleDayDTO>> typeReference = new TypeReference<>() {
            };
            InputStream inputStream = TypeReference.class.getResourceAsStream("/scheduleDay.json");
            List<ScheduleDayDTO> scheduleDayDTOs = mapper.readValue(inputStream, typeReference);
            for (ScheduleDayDTO dto : scheduleDayDTOs) {
                ScheduleDay scheduleDay = new ScheduleDay();
                scheduleDay.setDepartureStation(stationRepository.findById(dto.getDepartureStationId()).orElseThrow());
                scheduleDay.setArrivalStation(stationRepository.findById(dto.getArrivalStationId()).orElseThrow());
                scheduleDay.setDepartureTime(convertStringToTime(dto.getDepartureTime()));
                scheduleDay.setArrivalTime(convertStringToTime(dto.getArrivalTime()));

                scheduleDayList.add(scheduleDay);
            }

            scheduleDayRepository.saveAll(scheduleDayList);

            logger.info("Seeded initial scheduleDays data");
        } else {
            logger.info("ScheduleDays already exist in the database. No seeding needed.");
        }
    }

    private Time convertStringToTime(String timeString) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        long ms = sdf.parse(timeString).getTime();
        return new Time(ms);
    }

    public void unseed() {
        logger.info("Deleting all scheduleDays data.");
        scheduleDayRepository.deleteAll();
        logger.info("All scheduleDays data deleted.");
    }
}
