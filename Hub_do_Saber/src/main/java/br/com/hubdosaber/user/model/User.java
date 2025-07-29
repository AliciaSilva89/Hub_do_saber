package br.com.hubdosaber.user.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String matriculation;
    private String password;
    private String name;
    private String email;

    @Column(name = "course_id")
    private UUID courseId;

    @Column(name = "profile_id")
    private Integer profileId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public User() {
    }


    public User(UUID id, String matriculation, String password, String name, String email, UUID courseId, Integer profileId, LocalDateTime createdAt) {
        this.id = id;
        this.matriculation = matriculation;
        this.password = password;
        this.name = name;
        this.email = email;
        this.courseId = courseId;
        this.profileId = profileId;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getMatriculation() {
        return matriculation;
    }

    public void setMatriculation(String matriculation) {
        this.matriculation = matriculation;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UUID getCourseId() {
        return courseId;
    }

    public void setCourseId(UUID courseId) {
        this.courseId = courseId;
    }

    public Integer getProfileId() {
        return profileId;
    }

    public void setProfileId(Integer profileId) {
        this.profileId = profileId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}