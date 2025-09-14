package br.com.hubdosaber.group.model;

import br.com.hubdosaber.discipline.model.Discipline;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import java.util.UUID;
import br.com.hubdosaber.group.model.UserGroup;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "study_group")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String name;

    private String description;

    int maxMembers;

    boolean monitoring;

    boolean active;

    @ManyToOne
    @JoinColumn(name = "discipline_id")
    private Discipline discipline;

    @OneToMany(mappedBy = "studyGroup")
    @JsonManagedReference
    private List<UserGroup> userGroups;

}
