package br.com.hubdosaber.discipline.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DisciplineDTO {
    private UUID id;
    private String name;
    private String description;
    private String code;
    private Integer semester;
    private UUID courseId;
    private String courseName;
}

