package br.com.hubdosaber.course.service;

import br.com.hubdosaber.course.dto.CourseDTO;
import br.com.hubdosaber.course.model.Course;
import br.com.hubdosaber.course.repositoy.CourseRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    public List<CourseDTO> findCoursesByUniversityId(UUID universityId) {

        return courseRepository.findCoursesWithUniversityByUniversityId(universityId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    private CourseDTO convertToDTO(Course course) {
        return new CourseDTO(
                course.getId(),
                course.getName(),
                course.getUniversity().getId(),
                course.getUniversity().getName());
    }
}