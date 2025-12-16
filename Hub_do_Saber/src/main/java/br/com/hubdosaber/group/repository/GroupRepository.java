package br.com.hubdosaber.group.repository;

import br.com.hubdosaber.group.model.StudyGroup;
import br.com.hubdosaber.user.model.User;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface GroupRepository extends JpaRepository<StudyGroup, UUID> {

    List<StudyGroup> findByUserGroups_IdIn(Collection<UUID> ids);

    List<StudyGroup> findByUserGroups_User(User user);
}
