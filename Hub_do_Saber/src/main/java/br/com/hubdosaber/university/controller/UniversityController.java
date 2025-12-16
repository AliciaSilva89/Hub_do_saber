package br.com.hubdosaber.university.controller;


import br.com.hubdosaber.university.dto.UniversityDTO;
import br.com.hubdosaber.university.service.UniversityService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
@AllArgsConstructor
public class UniversityController {

    private final UniversityService universityService;

    @GetMapping
    public ResponseEntity<List<UniversityDTO>> getAllUniversities() {
        List<UniversityDTO> universities = universityService.findAllUniversities();
        return new ResponseEntity<>(universities, HttpStatus.OK);
    }
}
