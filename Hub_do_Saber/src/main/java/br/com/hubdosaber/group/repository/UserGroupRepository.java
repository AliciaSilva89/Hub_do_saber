package br.com.hubdosaber.group.repository;

import br.com.hubdosaber.group.model.StudyGroup;
import br.com.hubdosaber.group.model.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.hubdosaber.user.model.User;

import java.util.List;
import java.util.UUID;

public interface UserGroupRepository extends JpaRepository<UserGroup, UUID> {

}
