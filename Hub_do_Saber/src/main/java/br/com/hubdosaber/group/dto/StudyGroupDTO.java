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

    public StudyGroupDTO(UUID id, String name, String description, int maxMembers, boolean monitoring, boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.maxMembers = maxMembers;
        this.monitoring = monitoring;
        this.active = active;
    }
}
