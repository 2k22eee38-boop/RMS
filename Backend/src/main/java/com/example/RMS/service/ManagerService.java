package com.example.RMS.service;

import com.example.RMS.dto.NoticeRequest;
import com.example.RMS.dto.UserRequest;
import com.example.RMS.entity.Complaint;
import com.example.RMS.entity.Notice;
import com.example.RMS.entity.User;
import com.example.RMS.entity.VacationRequest;
import com.example.RMS.repository.ComplaintRepository;
import com.example.RMS.repository.NoticeRepository;
import com.example.RMS.repository.UserRepository;
import com.example.RMS.repository.VacationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final UserRepository userRepository;
    private final NoticeRepository noticeRepository;
    private final ComplaintRepository complaintRepository;
    private final VacationRequestRepository vacationRequestRepository;

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

    public List<User> getResidents() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.RESIDENT)
                .toList();
    }

    public Notice createNotice(NoticeRequest request) {
        Notice notice = new Notice();
        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        notice.setDate(LocalDateTime.now());
        return noticeRepository.save(notice);
    }

    public Notice updateNotice(Long id, NoticeRequest request) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
        notice.setTitle(request.getTitle());
        notice.setContent(request.getContent());
        return noticeRepository.save(notice);
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }

    public void deleteResident(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        if (user.getRole() != User.Role.RESIDENT) {
            throw new RuntimeException("Cannot delete non-resident user");
        }
        userRepository.deleteById(id);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

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

    public List<VacationRequest> getAllVacationRequests() {
        return vacationRequestRepository.findAllByOrderByCreatedAtDesc();
    }

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
