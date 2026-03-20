package com.example.RMS.service;

import com.example.RMS.dto.Request.NoticeRequest;
import com.example.RMS.dto.Request.UserRequest;
import com.example.RMS.entity.Complaint;
import com.example.RMS.entity.Employee;
import com.example.RMS.entity.Notice;
import com.example.RMS.entity.User;
import com.example.RMS.entity.VacationRequest;
import com.example.RMS.dto.Request.EmployeeRequest;

import com.example.RMS.entity.AmenityBooking;

import com.example.RMS.entity.Facility;
import com.example.RMS.dto.Request.FacilityUpdateRequest;

import java.util.List;

public interface ManagerService {
    User addResident(UserRequest request);
    List<User> getResidents();
    Notice createNotice(NoticeRequest request);
    Notice updateNotice(Long id, NoticeRequest request);
    void deleteNotice(Long id);
    void deleteResident(Long id);
    List<Complaint> getAllComplaints();
    Complaint updateComplaintStatus(Long id, String statusStr);
    List<VacationRequest> getAllVacationRequests();
    VacationRequest updateVacationStatus(Long id, String statusStr);
    Employee addEmployee(EmployeeRequest request);
    List<Employee> getAllEmployees();
    void deleteEmployee(Long id);
    List<AmenityBooking> getAllAmenityBookings();
    AmenityBooking updateAmenityBookingStatus(Long id, String statusStr);
    List<Facility> getAllFacilities();
    Facility updateFacility(Long id, FacilityUpdateRequest request);
}
