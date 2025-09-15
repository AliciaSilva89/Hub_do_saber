package br.com.hubdosaber.discipline.controller;

import br.com.hubdosaber.discipline.dto.DisciplineDTO;
import br.com.hubdosaber.discipline.service.DisciplineService;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/discipline")
@AllArgsConstructor
public class DisciplineController {

    private final DisciplineService disciplineService;

    @GetMapping
    public ResponseEntity<List<DisciplineDTO>> getAllDisciplines(@RequestParam("courseId") UUID courseId) {
        List<DisciplineDTO> disciplines = disciplineService.findDisciplinesByCourseId(courseId);
        return ResponseEntity.ok(disciplines);
    }
}
