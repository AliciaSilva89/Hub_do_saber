package br.com.hubdosaber.user.dto;

import br.com.hubdosaber.user.dto.UserDTO.CourseDTO;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserMemberDTO {
    private UUID id;
    private String matriculation;
    private String name;
    private String email;
    private CourseDTO course;
}
