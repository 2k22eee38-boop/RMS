package com.example.RMS.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Shift shift;

    public enum Category {
        SECURITY,
        SWEEPER,
        PLUMBER,
        ELECTRICIAN,
        GARDENER,
        OTHER
    }

    public enum Shift {
        DAY,
        NIGHT
    }
}
