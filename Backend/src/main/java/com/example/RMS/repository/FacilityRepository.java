package com.example.RMS.repository;

import com.example.RMS.entity.AmenityBooking;
import com.example.RMS.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {
    Optional<Facility> findByName(AmenityBooking.Amenity name);
}
