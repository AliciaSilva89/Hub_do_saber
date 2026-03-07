package br.com.hubdosaber.discipline.repository;

import br.com.hubdosaber.discipline.model.Discipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DisciplineRepository extends JpaRepository<Discipline, UUID> {

    @Query("SELECT d FROM Discipline d JOIN FETCH d.course c WHERE c.id = :courseId")
    List<Discipline> findDisciplinesWithCourseByCourseId(@Param("courseId") UUID courseId);


}