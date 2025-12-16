package br.com.hubdosaber.discipline.repository;

import br.com.hubdosaber.discipline.model.UserDisciplineInterest;
import br.com.hubdosaber.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface UserDisciplineInterestRepository extends JpaRepository<UserDisciplineInterest, UUID> {
    List<UserDisciplineInterest> findByUser(User user);
}
