package com.example.RMS.service.serviceImpl;

import com.example.RMS.dto.Request.NoticeRequest;
import com.example.RMS.dto.Request.UserRequest;
import com.example.RMS.entity.AmenityBooking;
import com.example.RMS.entity.Complaint;
import com.example.RMS.entity.Employee;
import com.example.RMS.entity.Facility;
import com.example.RMS.entity.Notice;
import com.example.RMS.entity.User;
import com.example.RMS.entity.VacationRequest;
import com.example.RMS.dto.Request.EmployeeRequest;
import com.example.RMS.dto.Request.FacilityUpdateRequest;
import com.example.RMS.repository.AmenityBookingRepository;
import com.example.RMS.repository.ComplaintRepository;
import com.example.RMS.repository.EmployeeRepository;
import com.example.RMS.repository.FacilityRepository;
import com.example.RMS.repository.NoticeRepository;
import com.example.RMS.repository.UserRepository;
import com.example.RMS.repository.VacationRequestRepository;
import com.example.RMS.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    private final UserRepository userRepository;
    private final NoticeRepository noticeRepository;
    private final ComplaintRepository complaintRepository;
    private final VacationRequestRepository vacationRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final AmenityBookingRepository amenityBookingRepository;
    private final FacilityRepository facilityRepository;

    @Override
    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    @Override
    public Facility updateFacility(Long id, FacilityUpdateRequest request) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facility not found"));

        facility.setSupervisorName(request.getSupervisorName());
        facility.setSupervisorPhone(request.getSupervisorPhone());
        facility.setClosed(request.isClosed());
        
        if (request.getClosedFrom() != null && !request.getClosedFrom().isEmpty()) {
            facility.setClosedFrom(java.time.LocalDate.parse(request.getClosedFrom()));
        } else {
            facility.setClosedFrom(null);
        }
        
        if (request.getClosedUntil() != null && !request.getClosedUntil().isEmpty()) {
            facility.setClosedUntil(java.time.LocalDate.parse(request.getClosedUntil()));
        } else {
            facility.setClosedUntil(null);
        }
        
        facility.setClosureReason(request.getClosureReason());
        
        return facilityRepository.save(facility);
    }

    @Override
    public List<AmenityBooking> getAllAmenityBookings() {
        return amenityBookingRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public AmenityBooking updateAmenityBookingStatus(Long id, String statusStr) {
        AmenityBooking booking = amenityBookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        try {
            AmenityBooking.Status newStatus = AmenityBooking.Status.valueOf(statusStr.toUpperCase());
            booking.setStatus(newStatus);
            return amenityBookingRepository.save(booking);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }
    }

    @Override
    public Employee addEmployee(EmployeeRequest request) {
        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setPhone(request.getPhone());
        
        try {
            employee.setCategory(Employee.Category.valueOf(request.getCategory().toUpperCase()));
        } catch (IllegalArgumentException e) {
            employee.setCategory(Employee.Category.OTHER);
        }
        
        try {
            employee.setShift(Employee.Shift.valueOf(request.getShift().toUpperCase()));
        } catch (IllegalArgumentException e) {
            employee.setShift(Employee.Shift.DAY);
        }
        
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public User addResident(UserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword()); // In real app, hash this
        user.setRole(User.Role.RESIDENT);
        user.setFlatNo(request.getFlatNo());
        user.setFamilyLeader(request.getFamilyLeader());
        user.setMemberCount(request.getMemberCount());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        return userRepository.save(user);
    }

    @Override
    public List<User> getResidents() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.RESIDENT)
                .toList();
    }

    @Override
    public Notice createNotice(NoticeRequest request) {
        Notice notice = new Notice();
        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setDate(LocalDateTime.now());
        return noticeRepository.save(notice);
    }

    @Override
    public Notice updateNotice(Long id, NoticeRequest request) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        return noticeRepository.save(notice);
    }

    @Override
    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }

    @Override
    public void deleteResident(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        if (user.getRole() != User.Role.RESIDENT) {
            throw new RuntimeException("Cannot delete non-resident user");
        }
        userRepository.deleteById(id);
    }

    @Override
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Complaint updateComplaintStatus(Long id, String statusStr) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        
        try {
            Complaint.Status newStatus = Complaint.Status.valueOf(statusStr.toUpperCase());
            complaint.setStatus(newStatus);
            return complaintRepository.save(complaint);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }
    }

    @Override
    public List<VacationRequest> getAllVacationRequests() {
        return vacationRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public VacationRequest updateVacationStatus(Long id, String statusStr) {
        VacationRequest request = vacationRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vacation request not found"));

        try {
            VacationRequest.Status newStatus = VacationRequest.Status.valueOf(statusStr.toUpperCase());
            request.setStatus(newStatus);
            VacationRequest savedRequest = vacationRequestRepository.save(request);

            if (newStatus == VacationRequest.Status.ACCEPTED) {
                // Automatically publish a vacancy notice
                Notice notice = new Notice();
                notice.setTitle("Vacancy Alert: Upcoming Unit Vacancy");
                notice.setContent("Important: Unit occupied by " + request.getResident().getUsername() + 
                                 " will be available for occupancy from " + request.getVacateDate() + ". " +
                                 "Interested parties can contact the management office.");
                notice.setDate(LocalDateTime.now());
                noticeRepository.save(notice);
            }

            return savedRequest;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }
    }
}
