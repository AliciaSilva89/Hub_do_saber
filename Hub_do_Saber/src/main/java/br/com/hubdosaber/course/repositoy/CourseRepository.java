package br.com.hubdosaber.course.repositoy;

import br.com.hubdosaber.course.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByUniversityId(UUID universityId);
    Optional<Course> findByName(String name);
    Optional<Course> findByNameIgnoreCase(String name);

    
}
