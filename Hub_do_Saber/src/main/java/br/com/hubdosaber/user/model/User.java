package br.com.hubdosaber.user.model;

import br.com.hubdosaber.course.model.Course;
import br.com.hubdosaber.discipline.model.UserDisciplineInterest;
import jakarta.persistence.*;
import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Where(clause = "is_active = true")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String matriculation;

    @Column(nullable = false)
    @ToString.Exclude
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(nullable = false)
    private Boolean isActive = true;

    @OneToMany(mappedBy = "user", orphanRemoval = true)
    private Set<UserDisciplineInterest> disciplineInterests;
}