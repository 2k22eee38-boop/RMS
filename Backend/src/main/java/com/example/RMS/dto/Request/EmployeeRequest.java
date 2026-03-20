package com.example.RMS.dto.Request;

import lombok.Data;

@Data
public class EmployeeRequest {
    private String name;
    private String category;
    private String phone;
    private String shift;
}
