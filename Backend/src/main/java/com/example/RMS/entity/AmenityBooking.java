package com.example.RMS.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "amenity_bookings")
public class AmenityBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resident_id", nullable = false)
    private User resident;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Amenity amenity;

    @Column(nullable = false)
    private LocalDate bookingDate;

    // Time fields can be null if it's a full-day booking
    private LocalTime startTime;
    private LocalTime endTime;

    @Column(nullable = false)
    private Boolean isFullDay;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    public enum Amenity {
        SWIMMING_POOL,
        THEATRE,
        PARTY_HALL,
        GAME_COURT,
        GYM,
        OTHER
    }
}
