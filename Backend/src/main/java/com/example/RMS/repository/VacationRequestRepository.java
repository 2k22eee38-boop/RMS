package com.example.RMS.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.RMS.entity.VacationRequest;

@Repository
public interface VacationRequestRepository extends JpaRepository<VacationRequest, Long> {
    List<VacationRequest> findByResidentIdOrderByCreatedAtDesc(Long residentId);
    List<VacationRequest> findAllByOrderByCreatedAtDesc();
}
