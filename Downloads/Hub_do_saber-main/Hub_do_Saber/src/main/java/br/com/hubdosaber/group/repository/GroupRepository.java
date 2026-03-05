package br.com.hubdosaber.group.repository;

import br.com.hubdosaber.group.model.StudyGroup;
import br.com.hubdosaber.user.model.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GroupRepository extends JpaRepository<StudyGroup, UUID> {

        // ✅ Adicionado DISTINCT para evitar duplicatas
        @Query("SELECT DISTINCT g FROM StudyGroup g " +
                        "JOIN FETCH g.discipline d " +
                        "JOIN FETCH d.course c " +
                        "JOIN FETCH c.university u " +
                        "LEFT JOIN FETCH g.userGroups ug " +
                        "LEFT JOIN FETCH ug.user " +
                        "WHERE g.active = true")
        List<StudyGroup> findAllWithDetails();

        // ✅ Adicionado DISTINCT para evitar duplicatas
        @Query("SELECT DISTINCT g FROM StudyGroup g " +
                        "JOIN FETCH g.discipline d " +
                        "JOIN FETCH d.course c " +
                        "JOIN FETCH c.university u " +
                        "LEFT JOIN FETCH g.userGroups ug " +
                        "LEFT JOIN FETCH ug.user " +
                        "WHERE ug.user = :user AND g.active = true")
        List<StudyGroup> findByUserGroups_UserWithDetails(@Param("user") User user);

        // ✅ Adicionado DISTINCT para evitar duplicatas
        @Query("SELECT DISTINCT g FROM StudyGroup g " +
                        "JOIN FETCH g.discipline d " +
                        "JOIN FETCH d.course c " +
                        "JOIN FETCH c.university u " +
                        "LEFT JOIN FETCH g.userGroups ug " +
                        "LEFT JOIN FETCH ug.user " +
                        "WHERE g.id = :id")
        Optional<StudyGroup> findGroupDetailById(@Param("id") UUID id);
}
