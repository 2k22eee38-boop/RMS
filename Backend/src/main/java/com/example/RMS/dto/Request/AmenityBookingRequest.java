package com.example.RMS.dto.Request;

import lombok.Data;

@Data
public class AmenityBookingRequest {
    private String amenity;
    private String bookingDate; // ISO-8601 (yyyy-MM-dd)
    private String startTime;   // ISO-8601 (HH:mm)
    private String endTime;     // ISO-8601 (HH:mm)
    private Boolean isFullDay;
}
