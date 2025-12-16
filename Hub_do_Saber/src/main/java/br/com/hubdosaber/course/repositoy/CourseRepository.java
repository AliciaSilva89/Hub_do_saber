package br.com.hubdosaber.course.repositoy;

import br.com.hubdosaber.course.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    @Query("SELECT c FROM Course c JOIN FETCH c.university u WHERE u.id = :universityId")
    List<Course> findCoursesWithUniversityByUniversityId(@Param("universityId") UUID universityId);

    Optional<Course> findByName(String name);

    Optional<Course> findByNameIgnoreCase(String name);
}