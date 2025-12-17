package br.com.hubdosaber.group.service;

import br.com.hubdosaber.discipline.repository.DisciplineRepository;
import br.com.hubdosaber.group.dto.StudyGroupDetailDTO;
import br.com.hubdosaber.group.dto.StudyGroupDTO;
import br.com.hubdosaber.group.model.StudyGroup;
import br.com.hubdosaber.group.model.UserGroup;
import br.com.hubdosaber.group.model.UserGroupType;
import br.com.hubdosaber.group.repository.GroupRepository;
import br.com.hubdosaber.group.repository.UserGroupRepository;
import br.com.hubdosaber.group.request.CreateGroupRequest;
import br.com.hubdosaber.group.request.UpdateGroupRequest;
import br.com.hubdosaber.user.model.User;
import br.com.hubdosaber.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class GroupService {
    private final GroupRepository groupRepository;
    private final UserGroupRepository userGroupRepository;
    private final UserRepository userRepository;
    private final DisciplineRepository disciplineRepository;

    @Transactional 
    public StudyGroup createGroup(CreateGroupRequest createGroupRequest, String userId) {
        Objects.requireNonNull(userId, "User id is required");

        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        UUID disciplineId = Objects.requireNonNull(createGroupRequest.getDisciplineId(), "Discipline id is required");

        var discipline = disciplineRepository.findById(disciplineId)
                .orElseThrow(() -> new RuntimeException("Discipline not found with id: " + disciplineId));

        // Criação da entidade
        StudyGroup studyGroup = new StudyGroup();
        studyGroup.setName(createGroupRequest.getName());
        studyGroup.setDescription(createGroupRequest.getDescription());
        studyGroup.setMaxMembers(createGroupRequest.getMaxMembers());
        studyGroup.setMonitoring(createGroupRequest.isMonitoring());
        studyGroup.setActive(true);
        studyGroup.setDiscipline(discipline);

        // 1. Salva o grupo primeiro para gerar o ID
        StudyGroup savedStudyGroup = groupRepository.save(studyGroup);

        // 2. Cria o vínculo do criador como DONO (OWNER)
        UserGroup userGroup = new UserGroup(user, savedStudyGroup, UserGroupType.OWNER);
        userGroupRepository.save(userGroup);

        // 3. Retorna o grupo salvo (contendo o ID gerado)
        return savedStudyGroup;
    }



    
    public void updateGroup(String groupId, UpdateGroupRequest updateGroupRequest, String userId) {
        Objects.requireNonNull(groupId, "Group id is required");
        Objects.requireNonNull(userId, "User id is required");

        StudyGroup group = groupRepository.findGroupDetailById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        
        boolean isOwner = group.getUserGroups().stream()
                .anyMatch(ug -> ug.getType() == UserGroupType.OWNER && ug.getUser() != null && ug.getUser().getId() != null && ug.getUser().getId().toString().equals(userId));

        if (!isOwner) {
            throw new RuntimeException("You are not the owner of this group and cannot edit it.");
        }

        
        if (updateGroupRequest.getName() != null) {
            group.setName(updateGroupRequest.getName());
        }
        if (updateGroupRequest.getDescription() != null) {
            group.setDescription(updateGroupRequest.getDescription());
        }
        if (updateGroupRequest.getMaxMembers() != null) {
            group.setMaxMembers(updateGroupRequest.getMaxMembers());
        }
        if (updateGroupRequest.getMonitoring() != null) {
            group.setMonitoring(updateGroupRequest.getMonitoring());
        }
        if (updateGroupRequest.getActive() != null) {
            group.setActive(updateGroupRequest.getActive());
        }

        if (updateGroupRequest.getDisciplineId() != null) {
            var currentDiscipline = Objects.requireNonNull(group.getDiscipline(), "Discipline is required");
            if (!updateGroupRequest.getDisciplineId().equals(currentDiscipline.getId())) {
                var discipline = disciplineRepository.findById(updateGroupRequest.getDisciplineId())
                        .orElseThrow(() -> new RuntimeException(
                                "Discipline not found with id: " + updateGroupRequest.getDisciplineId()));
                group.setDiscipline(discipline);
            }
        }

        groupRepository.save(group);
    }

    
    public List<StudyGroupDTO> listAllGroups() {
        return groupRepository.findAllWithDetails().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    
    public List<StudyGroupDTO> listGroupsByUser(String userId) {
        Objects.requireNonNull(userId, "User id is required");
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return groupRepository.findByUserGroups_UserWithDetails(user).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void joinGroup(String groupId, String userId) {
        Objects.requireNonNull(userId, "User id is required");
        Objects.requireNonNull(groupId, "Group id is required");
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        StudyGroup studyGroup = groupRepository.findById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
        UserGroup userGroup = new UserGroup(user, studyGroup, UserGroupType.MEMBER);
        userGroupRepository.save(userGroup);
    }

    
    public StudyGroupDetailDTO getGroupDetailById(String groupId) {
        Objects.requireNonNull(groupId, "Group id is required");
        StudyGroup studyGroup = groupRepository.findGroupDetailById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        
        return new StudyGroupDetailDTO(studyGroup);
    }

    
    private StudyGroupDTO toDTO(StudyGroup group) {
        
        UserGroup ownerUserGroup = group.getUserGroups().stream()
                .filter(ug -> ug.getType() == UserGroupType.OWNER)
                .findFirst()
                .orElse(null);

        UUID ownerId = null;
        String ownerName = null;
        if (ownerUserGroup != null) {
            ownerId = ownerUserGroup.getUser().getId();
            ownerName = ownerUserGroup.getUser().getName();
        }

        // Garantir que discipline, course e university não são nulos para evitar problemas de null-safety
        var discipline = java.util.Objects.requireNonNull(group.getDiscipline(), "Discipline is required");
        var course = java.util.Objects.requireNonNull(discipline.getCourse(), "Course is required for discipline");
        var university = java.util.Objects.requireNonNull(course.getUniversity(), "University is required for course");

        return new StudyGroupDTO(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getMaxMembers(),
                group.isMonitoring(),
                group.isActive(),
                discipline.getId(),
                discipline.getName(),
                course.getName(),
                university.getName(),
                ownerId,
                ownerName,
                
                group.getUserGroups().size());
    }
}