package com.example.RMS.controller;

import com.example.RMS.dto.Request.NoticeRequest;
import com.example.RMS.dto.Request.StatusUpdateRequest;
import com.example.RMS.dto.Request.UserRequest;
import com.example.RMS.entity.Complaint;
import com.example.RMS.entity.Notice;
import com.example.RMS.entity.User;
import com.example.RMS.entity.VacationRequest;
import com.example.RMS.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ManagerController {

    private final ManagerService managerService;

    @PostMapping("/residents")
    public ResponseEntity<User> addResident(@RequestBody UserRequest request) {
        return ResponseEntity.ok(managerService.addResident(request));
    }

    @GetMapping("/residents")
    public ResponseEntity<List<User>> getResidents() {
        return ResponseEntity.ok(managerService.getResidents());
    }

    @PostMapping("/notices")
    public ResponseEntity<Notice> createNotice(@RequestBody NoticeRequest request) {
        return ResponseEntity.ok(managerService.createNotice(request));
    }

    @PutMapping("/notices/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable Long id, @RequestBody NoticeRequest request) {
        return ResponseEntity.ok(managerService.updateNotice(id, request));
    }

    @DeleteMapping("/notices/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        managerService.deleteNotice(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/residents/{id}")
    public ResponseEntity<Void> deleteResident(@PathVariable Long id) {
        managerService.deleteResident(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(managerService.getAllComplaints());
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<Complaint> updateComplaintStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(managerService.updateComplaintStatus(id, request.getStatus()));
    }

    @GetMapping("/vacate")
    public ResponseEntity<List<VacationRequest>> getAllVacationRequests() {
        return ResponseEntity.ok(managerService.getAllVacationRequests());
    }

    @PutMapping("/vacate/{id}/status")
    public ResponseEntity<VacationRequest> updateVacationStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(managerService.updateVacationStatus(id, request.getStatus()));
    }
}
