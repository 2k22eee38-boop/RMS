package com.example.RMS.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "facilities")
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private AmenityBooking.Amenity name;

    private String supervisorName;
    private String supervisorPhone;

    @Column(nullable = false)
    private boolean isClosed;

    private LocalDate closedFrom;
    private LocalDate closedUntil;
    private String closureReason;
}
