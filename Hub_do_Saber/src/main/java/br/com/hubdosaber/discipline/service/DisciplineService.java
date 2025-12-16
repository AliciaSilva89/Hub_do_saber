package br.com.hubdosaber.discipline.service;

import br.com.hubdosaber.course.model.Course;
import br.com.hubdosaber.discipline.dto.DisciplineDTO;
import br.com.hubdosaber.discipline.model.Discipline;
import br.com.hubdosaber.discipline.repository.DisciplineRepository;
import br.com.hubdosaber.course.repositoy.CourseRepository;

import br.com.hubdosaber.discipline.request.UpdateDisciplineRequest;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DisciplineService {

    private final DisciplineRepository disciplineRepository;
    private final CourseRepository courseRepository;

    public List<DisciplineDTO> findDisciplinesByCourseId(java.util.UUID courseId) {

        return disciplineRepository.findDisciplinesWithCourseByCourseId(courseId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    private DisciplineDTO convertToDTO(br.com.hubdosaber.discipline.model.Discipline discipline) {

        return new DisciplineDTO(
                discipline.getId(),
                discipline.getName(),
                discipline.getDescription(),
                discipline.getCode(),
                discipline.getSemester(),
                discipline.getCourse().getId(),
                discipline.getCourse().getName());
    }
    public DisciplineDTO updateDiscipline(UUID id, UpdateDisciplineRequest request) {
        Discipline discipline = disciplineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Discipline not found with id: " + id));

        if (request.getName() != null) {
            discipline.setName(request.getName());
        }
        if (request.getDescription() != null) {
            discipline.setDescription(request.getDescription());
        }
        if (request.getCode() != null) {
            discipline.setCode(request.getCode());
        }
        if (request.getSemester() != null) {
            discipline.setSemester(request.getSemester());
        }
        
        if (request.getCourseId() != null && !request.getCourseId().equals(discipline.getCourse().getId())) {
            Course newCourse = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + request.getCourseId()));
            discipline.setCourse(newCourse);
        }

        Discipline updated = disciplineRepository.save(discipline);
        return convertToDTO(updated);
    }
}