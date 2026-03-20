package com.example.RMS.repository;

import com.example.RMS.entity.VacationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VacationRequestRepository extends JpaRepository<VacationRequest, Long> {
    List<VacationRequest> findByResidentIdOrderByCreatedAtDesc(Long residentId);
    List<VacationRequest> findAllByOrderByCreatedAtDesc();
}


