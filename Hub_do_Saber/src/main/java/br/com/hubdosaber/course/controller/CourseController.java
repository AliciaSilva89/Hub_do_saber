package br.com.hubdosaber.course.controller;

import br.com.hubdosaber.course.dto.CourseDTO;
import br.com.hubdosaber.course.service.CourseService;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/course")
@AllArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses(@RequestParam("universityId") UUID universityId) {
        List<CourseDTO> courses = courseService.findCoursesByUniversityId(universityId);
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }
}
