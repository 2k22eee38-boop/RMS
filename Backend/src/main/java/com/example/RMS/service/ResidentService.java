package com.example.RMS.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.RMS.dto.Request.ComplaintRequest;
import com.example.RMS.entity.Complaint;
import com.example.RMS.entity.Notice;
import com.example.RMS.entity.User;
import com.example.RMS.entity.VacationRequest;
import com.example.RMS.repository.ComplaintRepository;
import com.example.RMS.repository.NoticeRepository;
import com.example.RMS.repository.UserRepository;
import com.example.RMS.repository.VacationRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ResidentService {

    private final NoticeRepository noticeRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final VacationRequestRepository vacationRequestRepository;

    public List<Notice> getNotices() {
        return noticeRepository.findAllByOrderByDateDesc();
    }

    public List<Complaint> getComplaints(Long residentId) {
        return complaintRepository.findByResidentIdOrderByCreatedAtDesc(residentId);
    }

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

    public List<VacationRequest> getVacationRequests(Long residentId) {
        return vacationRequestRepository.findByResidentIdOrderByCreatedAtDesc(residentId);
    }

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
