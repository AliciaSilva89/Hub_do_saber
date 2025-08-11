package br.com.hubdosaber.group.service;

import br.com.hubdosaber.group.dto.StudyGroupDTO;
import br.com.hubdosaber.group.model.StudyGroup;
import br.com.hubdosaber.group.model.UserGroup;
import br.com.hubdosaber.group.model.UserGroupType;
import br.com.hubdosaber.group.repository.GroupRepository;
import br.com.hubdosaber.group.repository.UserGroupRepository;
import br.com.hubdosaber.user.model.User;
import br.com.hubdosaber.user.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private UserGroupRepository userGroupRepository;
    @Autowired
    private UserRepository userRepository;

    public StudyGroup createGroup(StudyGroup studyGroup, String userId) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        StudyGroup savedStudyGroup = groupRepository.save(studyGroup);
        UserGroup userGroup = new UserGroup(user, savedStudyGroup, UserGroupType.OWNER);
        userGroupRepository.save(userGroup);
        return savedStudyGroup;
    }

    public List<StudyGroupDTO> listAllGroups() {
        return groupRepository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public List<StudyGroupDTO> listGroupsByUser(String userId) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return groupRepository.findByUserGroups_User(user).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void joinGroup(String groupId, String userId) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        StudyGroup studyGroup = groupRepository.findById(UUID.fromString(groupId)).orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));
        UserGroup userGroup = new UserGroup(user, studyGroup, UserGroupType.MEMBER);
        userGroupRepository.save(userGroup);
    }

    private StudyGroupDTO toDTO(StudyGroup group) {
        return new StudyGroupDTO(
            group.getId(),
            group.getName(),
            group.getDescription(),
            group.getMaxMembers(),
            group.isMonitoring(),
            group.isActive()
        );
    }
}
