package br.com.hubdosaber.course.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private UUID id;
    private String name;
    private UUID universityId;
    private String universityName;
}
