package br.com.hubdosaber.university.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "university")
public class University {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;

    private String acronym;

    @Column(name = "city_id")
    private Integer cityId; // Chave estrangeira para a entidade City

    public University() {
    }

    public University(String name, String acronym, Integer cityId) {
        this.name = name;
        this.acronym = acronym;
        this.cityId = cityId;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAcronym() {
        return acronym;
    }

    public Integer getCityId() {
        return cityId;
    }

    // Setters
    public void setId(UUID id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }
}