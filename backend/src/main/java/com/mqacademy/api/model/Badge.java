package com.mqacademy.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    public enum Rarity { COMMON, RARE, EPIC, LEGENDARY }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(nullable = false)
    private String name;

    private String description;
    private String icon;

    @Enumerated(EnumType.STRING)
    private Rarity rarity;
}
