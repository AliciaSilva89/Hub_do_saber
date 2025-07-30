package br.com.hubdosaber.university.controller;


import br.com.hubdosaber.university.model.University;
import br.com.hubdosaber.university.service.UniversityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/universities")
public class UniversityController {

    private final UniversityService universityService;

    public UniversityController(UniversityService universityService) {
        this.universityService = universityService;
    }

    @GetMapping
    public ResponseEntity<List<University>> getAllUniversities() {
        List<University> universities = universityService.findAllUniversities();
        return new ResponseEntity<>(universities, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<University> getUniversityById(@PathVariable UUID id) {
        return universityService.findUniversityById(id)
                .map(university -> new ResponseEntity<>(university, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<University> createUniversity(@RequestBody University university) {
        University savedUniversity = universityService.createUniversity(university);
        return new ResponseEntity<>(savedUniversity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<University> updateUniversity(@PathVariable UUID id, @RequestBody University universityDetails) {
        try {
            University updatedUniversity = universityService.updateUniversity(id, universityDetails);
            return new ResponseEntity<>(updatedUniversity, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteUniversity(@PathVariable UUID id) {
        try {
            universityService.deleteUniversity(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}