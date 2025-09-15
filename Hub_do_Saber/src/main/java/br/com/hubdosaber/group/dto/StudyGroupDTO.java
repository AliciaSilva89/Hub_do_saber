package br.com.hubdosaber.group.dto;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudyGroupDTO {
    private UUID id;
    private String name;
    private String description;
    private int maxMembers;
    private boolean monitoring;
    private boolean active;
    private UUID disciplineId;
    private String disciplineName;
    private String courseName;
    private String universityName;

    public StudyGroupDTO(UUID id, String name, String description, int maxMembers, boolean monitoring, boolean active, UUID disciplineId, String disciplineName, String courseName,String universityName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxMembers = maxMembers;
        this.monitoring = monitoring;
        this.active = active;
        this.disciplineId = disciplineId;
        this.disciplineName = disciplineName;
        this.courseName = courseName;
        this.universityName = universityName;
    }
}
