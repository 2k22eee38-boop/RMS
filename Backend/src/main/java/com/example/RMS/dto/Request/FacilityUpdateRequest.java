package com.example.RMS.dto.Request;

import lombok.Data;

@Data
public class FacilityUpdateRequest {
    private String supervisorName;
    private String supervisorPhone;
    private boolean closed;
    private String closedFrom;  // ISO string (yyyy-MM-dd)
    private String closedUntil; // ISO string 
    private String closureReason;
}
