package com.example.RMS.service;

import com.example.RMS.dto.Request.ComplaintRequest;
import com.example.RMS.entity.Complaint;
import com.example.RMS.entity.Employee;
import com.example.RMS.entity.Notice;
import com.example.RMS.entity.VacationRequest;

import com.example.RMS.dto.Request.AmenityBookingRequest;
import com.example.RMS.entity.AmenityBooking;

import com.example.RMS.entity.Facility;

import java.time.LocalDate;
import java.util.List;

public interface ResidentService {
    List<Notice> getNotices();
    List<Complaint> getComplaints(Long residentId);
    Complaint raiseComplaint(Long residentId, ComplaintRequest request);
    List<VacationRequest> getVacationRequests(Long residentId);
    VacationRequest submitVacationRequest(Long residentId, LocalDate vacateDate, String reason);
    List<Employee> getAllEmployees();
    AmenityBooking createAmenityBooking(Long residentId, AmenityBookingRequest request);
    List<AmenityBooking> getMyAmenityBookings(Long residentId);
    List<Facility> getAllFacilities();
}

