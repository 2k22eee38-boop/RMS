package com.example.RMS.service.serviceImpl;

import com.example.RMS.dto.Request.ComplaintRequest;
import com.example.RMS.entity.AmenityBooking;
import com.example.RMS.dto.Request.AmenityBookingRequest;
import com.example.RMS.dto.Request.ComplaintRequest;
import com.example.RMS.entity.Complaint;
import com.example.RMS.entity.Employee;
import com.example.RMS.entity.Facility;
import com.example.RMS.entity.Notice;
import com.example.RMS.entity.User;
import com.example.RMS.entity.VacationRequest;
import com.example.RMS.repository.AmenityBookingRepository;
import com.example.RMS.repository.ComplaintRepository;
import com.example.RMS.repository.EmployeeRepository;
import com.example.RMS.repository.FacilityRepository;
import com.example.RMS.repository.NoticeRepository;
import com.example.RMS.repository.UserRepository;
import com.example.RMS.repository.VacationRequestRepository;
import com.example.RMS.service.ResidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Arrays;
import jakarta.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
public class ResidentServiceImpl implements ResidentService {

    private final NoticeRepository noticeRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final VacationRequestRepository vacationRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final AmenityBookingRepository amenityBookingRepository;
    private final FacilityRepository facilityRepository;

    @PostConstruct
    public void initFacilities() {
        if (facilityRepository.count() == 0) {
            for (AmenityBooking.Amenity amenity : AmenityBooking.Amenity.values()) {
                if (amenity == AmenityBooking.Amenity.OTHER) continue;
                Facility f = new Facility();
                f.setName(amenity);
                f.setClosed(false);
                facilityRepository.save(f);
            }
        }
    }

    @Override
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    @Override
    public AmenityBooking createAmenityBooking(Long residentId, AmenityBookingRequest request) {
        User resident = userRepository.findById(residentId)
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        AmenityBooking booking = new AmenityBooking();
        booking.setResident(resident);
        
        AmenityBooking.Amenity requestedAmenity;
        try {
            requestedAmenity = AmenityBooking.Amenity.valueOf(request.getAmenity().toUpperCase());
        } catch (IllegalArgumentException e) {
            requestedAmenity = AmenityBooking.Amenity.OTHER;
        }
        booking.setAmenity(requestedAmenity);

        Facility facility = facilityRepository.findByName(requestedAmenity)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        LocalDate requestedDate = LocalDate.parse(request.getBookingDate());

        if (facility.isClosed()) {
            if (facility.getClosedFrom() != null && facility.getClosedUntil() != null) {
                if (!requestedDate.isBefore(facility.getClosedFrom()) && !requestedDate.isAfter(facility.getClosedUntil())) {
                    throw new RuntimeException("Facility is closed on this date: " + facility.getClosureReason());
                }
            } else {
                throw new RuntimeException("Facility is currently closed indefinitely: " + facility.getClosureReason());
            }
        }

        boolean reqFullDay = Boolean.TRUE.equals(request.getIsFullDay());
        LocalTime reqStart = reqFullDay ? null : LocalTime.parse(request.getStartTime());
        LocalTime reqEnd = reqFullDay ? null : LocalTime.parse(request.getEndTime());

        List<AmenityBooking> existingBookings = amenityBookingRepository.findByAmenityAndBookingDateAndStatusIn(
                requestedAmenity, requestedDate, Arrays.asList(AmenityBooking.Status.APPROVED, AmenityBooking.Status.PENDING));

        for (AmenityBooking ext : existingBookings) {
            if (ext.getIsFullDay() || reqFullDay) {
                throw new RuntimeException("This time slot overlaps with an existing booking.");
            }
            if (reqStart != null && reqEnd != null && ext.getStartTime() != null && ext.getEndTime() != null) {
                if (reqStart.isBefore(ext.getEndTime()) && reqEnd.isAfter(ext.getStartTime())) {
                    throw new RuntimeException("This time slot overlaps with an existing booking.");
                }
            }
        }
        
        booking.setBookingDate(requestedDate);
        booking.setIsFullDay(reqFullDay);
        booking.setStartTime(reqStart);
        booking.setEndTime(reqEnd);
        
        booking.setStatus(AmenityBooking.Status.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        
        return amenityBookingRepository.save(booking);
    }

    @Override
    public List<AmenityBooking> getMyAmenityBookings(Long residentId) {
        return amenityBookingRepository.findByResidentIdOrderByCreatedAtDesc(residentId);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public List<Notice> getNotices() {
        return noticeRepository.findAllByOrderByDateDesc();
    }

    @Override
    public List<Complaint> getComplaints(Long residentId) {
        return complaintRepository.findByResidentIdOrderByCreatedAtDesc(residentId);
    }

    @Override
    public Complaint raiseComplaint(Long residentId, ComplaintRequest request) {
        User resident = userRepository.findById(residentId)
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        Complaint complaint = new Complaint();
        complaint.setResident(resident);
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setStatus(Complaint.Status.PENDING);
        complaint.setCreatedAt(LocalDateTime.now());

        return complaintRepository.save(complaint);
    }

    @Override
    public List<VacationRequest> getVacationRequests(Long residentId) {
        return vacationRequestRepository.findByResidentIdOrderByCreatedAtDesc(residentId);
    }

    @Override
    public VacationRequest submitVacationRequest(Long residentId, LocalDate vacateDate, String reason) {
        if (vacateDate.isBefore(LocalDate.now().plusMonths(2))) {
            throw new RuntimeException("Notice period must be at least 2 months.");
        }

        User resident = userRepository.findById(residentId)
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        VacationRequest request = new VacationRequest();
        request.setResident(resident);
        request.setVacateDate(vacateDate);
        request.setReason(reason);
        request.setStatus(VacationRequest.Status.PENDING);
        request.setCreatedAt(LocalDateTime.now());

        return vacationRequestRepository.save(request);
    }
}

