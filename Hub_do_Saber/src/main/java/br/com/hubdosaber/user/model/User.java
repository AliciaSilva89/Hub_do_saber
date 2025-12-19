package br.com.hubdosaber.user.model;

import br.com.hubdosaber.course.model.Course;
import br.com.hubdosaber.discipline.model.UserDisciplineInterest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String matriculation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "profile_picture", columnDefinition = "TEXT")
    private String profilePicture;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen; // ✅ ADICIONAR

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserDisciplineInterest> disciplineInterests = new ArrayList<>();

    public Boolean isActive() {
        return isActive != null && isActive;
    }

    // ✅ ADICIONAR método para verificar se está online (últimos 5 minutos)
    public boolean isOnline() {
        if (lastSeen == null)
            return false;
        return lastSeen.isAfter(LocalDateTime.now().minusMinutes(5));
    }
}
