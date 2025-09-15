package br.com.hubdosaber.group.repository;

import br.com.hubdosaber.group.model.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserGroupRepository extends JpaRepository<UserGroup, UUID> {

}
