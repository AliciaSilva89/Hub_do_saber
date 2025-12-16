package br.com.hubdosaber.discipline.repository;

import br.com.hubdosaber.discipline.model.Discipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DisciplineRepository extends JpaRepository<Discipline, UUID> {
    List<Discipline> findByCourseId(UUID courseId);
}
