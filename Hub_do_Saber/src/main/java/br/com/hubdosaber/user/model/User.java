package br.com.hubdosaber.user.model;

import br.com.hubdosaber.course.model.Course;
import br.com.hubdosaber.discipline.model.UserDisciplineInterest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    // ✅ ADICIONE ESTE RELACIONAMENTO
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserDisciplineInterest> disciplineInterests = new ArrayList<>();

    // Método getter para isActive
    public Boolean isActive() {
        return isActive != null && isActive;
    }
}
