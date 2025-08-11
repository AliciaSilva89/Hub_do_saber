package br.com.hubdosaber.group.model;

import br.com.hubdosaber.user.model.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_group")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class UserGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    @JsonBackReference
    private StudyGroup studyGroup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserGroupType type;

    public UserGroup(User user, StudyGroup studyGroup, UserGroupType type) {
        this.user = user;
        this.studyGroup = studyGroup;
        this.type = type;
    }
}
