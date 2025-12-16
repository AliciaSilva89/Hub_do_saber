package br.com.hubdosaber.discipline.service;

import br.com.hubdosaber.discipline.dto.DisciplineDTO;
import br.com.hubdosaber.discipline.repository.DisciplineRepository;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DisciplineService {

    private final DisciplineRepository disciplineRepository;

    public List<DisciplineDTO> findDisciplinesByCourseId(java.util.UUID courseId) {
        return disciplineRepository.findByCourseId(courseId)
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
                discipline.getCourse().getName()
        );
    }
}
