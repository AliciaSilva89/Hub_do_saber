package br.com.hubdosaber.user.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private UUID id;
    private String matriculation;
    private String name;
    private String email;
    private CourseDTO course;
    private List<DisciplineDTO> disciplineInterests;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseDTO {
        private UUID id;
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DisciplineDTO {
        private UUID id;
        private String name;
        private String code;
    }
}
