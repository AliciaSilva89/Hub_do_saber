package br.com.hubdosaber.message.repository;

import br.com.hubdosaber.message.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    @Query("SELECT m FROM Message m " +
            "LEFT JOIN FETCH m.user u " +
            "LEFT JOIN FETCH u.course " +
            "WHERE m.group.id = :groupId " +
            "ORDER BY m.createdAt ASC")
    List<Message> findByGroupIdWithDetails(UUID groupId);
}
