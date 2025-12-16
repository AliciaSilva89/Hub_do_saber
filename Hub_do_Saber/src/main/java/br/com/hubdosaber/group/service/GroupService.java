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
import java.util.List;
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

    public StudyGroup createGroup(CreateGroupRequest createGroupRequest, String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

    
        var discipline = disciplineRepository.findById(createGroupRequest.getDisciplineId())
                .orElseThrow(() -> new RuntimeException(
                        "Discipline not found with id: " + createGroupRequest.getDisciplineId()));

        StudyGroup studyGroup = new StudyGroup();
        studyGroup.setName(createGroupRequest.getName());
        studyGroup.setDescription(createGroupRequest.getDescription());
        studyGroup.setMaxMembers(createGroupRequest.getMaxMembers());
        studyGroup.setMonitoring(createGroupRequest.isMonitoring());
        studyGroup.setActive(true);
        studyGroup.setDiscipline(discipline);

        StudyGroup savedStudyGroup = groupRepository.save(studyGroup);
        UserGroup userGroup = new UserGroup(user, savedStudyGroup, UserGroupType.OWNER);
        userGroupRepository.save(userGroup);
        return savedStudyGroup;
    }

    
    public void updateGroup(String groupId, UpdateGroupRequest updateGroupRequest, String userId) {
        
        StudyGroup group = groupRepository.findGroupDetailById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        
        boolean isOwner = group.getUserGroups().stream()
                .anyMatch(ug -> ug.getType() == UserGroupType.OWNER && ug.getUser().getId().toString().equals(userId));

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

        if (updateGroupRequest.getDisciplineId() != null
                && !updateGroupRequest.getDisciplineId().equals(group.getDiscipline().getId())) {
            var discipline = disciplineRepository.findById(updateGroupRequest.getDisciplineId())
                    .orElseThrow(() -> new RuntimeException(
                            "Discipline not found with id: " + updateGroupRequest.getDisciplineId()));
            group.setDiscipline(discipline);
        }

        groupRepository.save(group);
    }

    
    public List<StudyGroupDTO> listAllGroups() {
        return groupRepository.findAllWithDetails().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    
    public List<StudyGroupDTO> listGroupsByUser(String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return groupRepository.findByUserGroups_UserWithDetails(user).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void joinGroup(String groupId, String userId) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        StudyGroup studyGroup = groupRepository.findById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
        UserGroup userGroup = new UserGroup(user, studyGroup, UserGroupType.MEMBER);
        userGroupRepository.save(userGroup);
    }

    
    public StudyGroupDetailDTO getGroupDetailById(String groupId) {
        StudyGroup studyGroup = groupRepository.findGroupDetailById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        
        return new StudyGroupDetailDTO(studyGroup);
    }

    
    private StudyGroupDTO toDTO(StudyGroup group) {
        
        UserGroup ownerUserGroup = group.getUserGroups().stream()
                .filter(ug -> ug.getType() == UserGroupType.OWNER)
                .findFirst()
                .orElse(null);

        UUID ownerId = ownerUserGroup != null ? ownerUserGroup.getUser().getId() : null;
        String ownerName = ownerUserGroup != null ? ownerUserGroup.getUser().getName() : null;

        return new StudyGroupDTO(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getMaxMembers(),
                group.isMonitoring(),
                group.isActive(),
                group.getDiscipline().getId(),
                group.getDiscipline().getName(),
                group.getDiscipline().getCourse().getName(),
                group.getDiscipline().getCourse().getUniversity().getName(),
                ownerId,
                ownerName,
                
                group.getUserGroups().size());
    }
}