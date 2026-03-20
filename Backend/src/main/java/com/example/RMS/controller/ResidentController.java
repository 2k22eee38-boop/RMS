package com.example.RMS.controller;

import com.example.RMS.dto.Request.AmenityBookingRequest;
import com.example.RMS.dto.Request.ComplaintRequest;
import com.example.RMS.dto.Request.VacationRequestDTO;
import com.example.RMS.entity.AmenityBooking;
import com.example.RMS.entity.Complaint;
import com.example.RMS.entity.Employee;
import com.example.RMS.entity.Facility;
import com.example.RMS.entity.Notice;
import com.example.RMS.entity.VacationRequest;
import com.example.RMS.service.ResidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/resident")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ResidentController {

    private final ResidentService residentService;

    @GetMapping("/facilities")
    public ResponseEntity<List<Facility>> getAllFacilities() {
        return ResponseEntity.ok(residentService.getAllFacilities());
    }

    @PostMapping("/amenities")
    public ResponseEntity<AmenityBooking> createAmenityBooking(@RequestHeader("Resident-Id") Long residentId, @RequestBody AmenityBookingRequest request) {
        return ResponseEntity.ok(residentService.createAmenityBooking(residentId, request));
    }

    @GetMapping("/amenities")
    public ResponseEntity<List<AmenityBooking>> getMyAmenityBookings(@RequestHeader("Resident-Id") Long residentId) {
        return ResponseEntity.ok(residentService.getMyAmenityBookings(residentId));
    }

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(residentService.getAllEmployees());
    }

    @GetMapping("/notices")
    public ResponseEntity<List<Notice>> getNotices() {
        return ResponseEntity.ok(residentService.getNotices());
    }

    @PostMapping("/complaints")
    public ResponseEntity<Complaint> raiseComplaint(@RequestHeader("Resident-Id") Long residentId, @RequestBody ComplaintRequest request) {
        // Here we fake authentication context by reading a custom header `Resident-Id` from the frontend
        return ResponseEntity.ok(residentService.raiseComplaint(residentId, request));
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getComplaints(@RequestHeader("Resident-Id") Long residentId) {
        return ResponseEntity.ok(residentService.getComplaints(residentId));
    }

    @GetMapping("/vacate")
    public ResponseEntity<List<VacationRequest>> getVacationRequests(@RequestHeader("Resident-Id") Long residentId) {
        return ResponseEntity.ok(residentService.getVacationRequests(residentId));
    }

    @PostMapping("/vacate")
    public ResponseEntity<VacationRequest> notifyVacation(@RequestHeader("Resident-Id") Long residentId, @RequestBody VacationRequestDTO request) {
        return ResponseEntity.ok(residentService.submitVacationRequest(residentId, LocalDate.parse(request.getVacateDate()), request.getReason()));
    }
}

