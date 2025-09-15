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
    private UUID ownerId; // Adicionado para a verificação na lista de grupos
    private String ownerName; // Adicionado para exibir o nome do dono
    private int currentMembers; // Adicionado para mostrar a contagem de membros

    public StudyGroupDTO(UUID id, String name, String description, int maxMembers, boolean monitoring, boolean active, UUID disciplineId, String disciplineName, String courseName,String universityName, UUID ownerId, String ownerName, int currentMembers) {
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
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.currentMembers = currentMembers;
    }
}