package br.com.hubdosaber.group.dto;

import br.com.hubdosaber.group.model.StudyGroup;
import br.com.hubdosaber.group.model.UserGroupType;
import br.com.hubdosaber.user.dto.UserMemberDTO;
import br.com.hubdosaber.user.dto.UserDTO.CourseDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudyGroupDetailDTO {

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
    private List<UserMemberDTO> members = new ArrayList<>();
    private UUID ownerId; // Adicionado para a verificação de permissão
    private String ownerName; // Adicionado para exibir o nome do dono

    public StudyGroupDetailDTO(StudyGroup group) {
        this.id = group.getId();
        this.name = group.getName();
        this.description = group.getDescription();
        this.maxMembers = group.getMaxMembers();
        this.monitoring = group.isMonitoring();
        this.active = group.isActive();
        this.disciplineId = group.getDiscipline().getId();
        this.disciplineName = group.getDiscipline().getName();
        this.courseName = group.getDiscipline().getCourse().getName();
        this.universityName = group.getDiscipline().getCourse().getUniversity().getName();

        this.members = group.getUserGroups().stream()
                .map(userGroup -> {
                    if (userGroup.getType() == UserGroupType.OWNER) {
                        this.ownerId = userGroup.getUser().getId();
                        this.ownerName = userGroup.getUser().getName();
                    }
                    var user = userGroup.getUser();
                    var courseDTO = user.getCourse() != null
                        ? new CourseDTO(user.getCourse().getId(), user.getCourse().getName())
                        : null;
                    return new UserMemberDTO(
                        user.getId(),
                        user.getMatriculation(),
                        user.getName(),
                        user.getEmail(),
                        courseDTO
                    );
                })
                .collect(Collectors.toList());
    }
}