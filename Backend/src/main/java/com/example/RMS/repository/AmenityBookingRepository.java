package com.example.RMS.repository;

import com.example.RMS.entity.AmenityBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AmenityBookingRepository extends JpaRepository<AmenityBooking, Long> {
    List<AmenityBooking> findByResidentIdOrderByCreatedAtDesc(Long residentId);
    List<AmenityBooking> findAllByOrderByCreatedAtDesc();
    List<AmenityBooking> findByAmenityAndBookingDateAndStatusIn(AmenityBooking.Amenity amenity, LocalDate bookingDate, List<AmenityBooking.Status> statuses);
}
