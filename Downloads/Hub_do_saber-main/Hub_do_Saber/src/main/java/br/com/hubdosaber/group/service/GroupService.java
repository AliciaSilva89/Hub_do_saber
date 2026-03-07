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

        if (createGroupRequest.getMaxMembers() < 2) {
            throw new RuntimeException("O grupo deve ter no mínimo 2 membros");
        }
        if (createGroupRequest.getMaxMembers() > 100) {
            throw new RuntimeException("O grupo não pode ter mais de 100 membros");
        }

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

    @Transactional
    public void updateGroup(String groupId, UpdateGroupRequest updateGroupRequest, String userId) {
        Objects.requireNonNull(groupId, "Group id is required");
        Objects.requireNonNull(userId, "User id is required");

        StudyGroup group = groupRepository.findGroupDetailById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        boolean isOwner = group.getUserGroups().stream()
                .anyMatch(ug -> ug.getType() == UserGroupType.OWNER
                        && ug.getUser() != null
                        && ug.getUser().getId() != null
                        && ug.getUser().getId().toString().equals(userId));

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
            int currentMembers = (int) group.getUserGroups().stream()
                    .filter(ug -> ug.getUser() != null && ug.getUser().isActive())
                    .count();

            if (updateGroupRequest.getMaxMembers() < currentMembers) {
                throw new RuntimeException(
                        "Não é possível reduzir o limite de membros para menos que o número atual (" + currentMembers
                                + ")");
            }
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

    @Transactional(readOnly = true)
    public List<StudyGroupDTO> listAllGroups() {
        return groupRepository.findAllWithDetails().stream()
                .filter(group -> group.isActive())
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudyGroupDTO> listGroupsByUser(String userId) {
        Objects.requireNonNull(userId, "User id is required");
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return groupRepository.findByUserGroups_UserWithDetails(user).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void joinGroup(String groupId, String userId) {
        Objects.requireNonNull(userId, "User id is required");
        Objects.requireNonNull(groupId, "Group id is required");

        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        StudyGroup studyGroup = groupRepository.findGroupDetailById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        if (!studyGroup.isActive()) {
            throw new RuntimeException("Este grupo não está mais ativo");
        }

        boolean alreadyMember = studyGroup.getUserGroups().stream()
                .anyMatch(ug -> ug.getUser() != null && ug.getUser().getId().equals(user.getId()));

        if (alreadyMember) {
            throw new RuntimeException("Você já é membro deste grupo");
        }

        long currentMembers = studyGroup.getUserGroups().stream()
                .filter(ug -> ug.getUser() != null && ug.getUser().isActive())
                .count();

        if (currentMembers >= studyGroup.getMaxMembers()) {
            throw new RuntimeException("O grupo está cheio. Capacidade máxima: " + studyGroup.getMaxMembers());
        }

        UserGroup userGroup = new UserGroup(user, studyGroup, UserGroupType.MEMBER);
        userGroupRepository.save(userGroup);
    }

    @Transactional
    public void leaveGroup(String groupId, String userId) {
        Objects.requireNonNull(userId, "User id is required");
        Objects.requireNonNull(groupId, "Group id is required");

        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        StudyGroup studyGroup = groupRepository.findGroupDetailById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        boolean isOwner = studyGroup.getUserGroups().stream()
                .anyMatch(ug -> ug.getType() == UserGroupType.OWNER
                        && ug.getUser() != null
                        && ug.getUser().getId().equals(user.getId()));

        if (isOwner) {
            throw new RuntimeException("O dono do grupo não pode sair. Delete o grupo se necessário.");
        }

        UserGroup userGroup = studyGroup.getUserGroups().stream()
                .filter(ug -> ug.getUser() != null && ug.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Você não é membro deste grupo"));

        userGroupRepository.delete(userGroup);
    }

    @Transactional(readOnly = true)
    public StudyGroupDetailDTO getGroupDetailById(String groupId) {
        Objects.requireNonNull(groupId, "Group id is required");
        StudyGroup studyGroup = groupRepository.findGroupDetailById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        return new StudyGroupDetailDTO(studyGroup);
    }

    private StudyGroupDTO toDTO(StudyGroup group) {
        // Buscar o owner do grupo
        UserGroup ownerUserGroup = group.getUserGroups().stream()
                .filter(ug -> ug.getType() == UserGroupType.OWNER)
                .findFirst()
                .orElse(null);

        UUID ownerId = null;
        String ownerName = null;
        String ownerCourseName = null; // ✅ curso do criador

        if (ownerUserGroup != null && ownerUserGroup.getUser() != null) {
            var owner = ownerUserGroup.getUser();
            ownerId = owner.getId();
            ownerName = owner.getName();

            // ✅ Pega o curso do CRIADOR do grupo, não da disciplina
            if (owner.getCourse() != null) {
                ownerCourseName = owner.getCourse().getName();
            }
        }

        var discipline = Objects.requireNonNull(group.getDiscipline(), "Discipline is required");
        var course = Objects.requireNonNull(discipline.getCourse(), "Course is required for discipline");
        var university = Objects.requireNonNull(course.getUniversity(), "University is required for course");

        long uniqueMembersCount = group.getUserGroups().stream()
                .filter(ug -> ug.getUser() != null
                        && ug.getUser().getId() != null
                        && ug.getUser().isActive())
                .map(ug -> ug.getUser().getId())
                .distinct()
                .count();

        return new StudyGroupDTO(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getMaxMembers(),
                group.isMonitoring(),
                group.isActive(),
                discipline.getId(),
                discipline.getName(),
                // ✅ Curso do criador com fallback para curso da disciplina
                ownerCourseName != null ? ownerCourseName : course.getName(),
                university.getName(),
                ownerId,
                ownerName,
                (int) uniqueMembersCount);
    }

    @Transactional
    public void deleteGroup(String groupId, String userId) {
        StudyGroup group = groupRepository.findGroupDetailById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Grupo não encontrado"));

        boolean isOwner = group.getUserGroups().stream()
                .anyMatch(ug -> ug.getType() == UserGroupType.OWNER
                        && ug.getUser().getId().toString().equals(userId));

        if (!isOwner) {
            throw new RuntimeException("Apenas o dono pode apagar o grupo");
        }

        long otherMembers = group.getUserGroups().stream()
                .filter(ug -> ug.getType() != UserGroupType.OWNER)
                .count();

        if (otherMembers > 0) {
            throw new RuntimeException(
                    "Não é possível apagar o grupo com outros participantes");
        }

        userGroupRepository.deleteAll(group.getUserGroups());
        groupRepository.delete(group);
    }

}
