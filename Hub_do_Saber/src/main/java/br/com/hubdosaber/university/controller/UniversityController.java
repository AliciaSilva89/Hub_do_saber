package br.com.hubdosaber.university.controller;

import br.com.hubdosaber.university.dto.UniversityDTO;
import br.com.hubdosaber.university.request.CreateUniversityRequest;
import br.com.hubdosaber.university.service.UniversityService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/universities")
@AllArgsConstructor
public class UniversityController {

    private final UniversityService universityService;

    @PostMapping
    public ResponseEntity<UUID> createUniversity(@RequestBody CreateUniversityRequest request) {
        UUID universityId = universityService.createUniversity(request);
        return new ResponseEntity<>(universityId, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UniversityDTO>> getAllUniversities() {
        List<UniversityDTO> universities = universityService.findAllUniversities();
        return new ResponseEntity<>(universities, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UniversityDTO> getUniversityById(@PathVariable UUID id) {
        Optional<UniversityDTO> university = universityService.findUniversityDTOById(id);
        return university.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}