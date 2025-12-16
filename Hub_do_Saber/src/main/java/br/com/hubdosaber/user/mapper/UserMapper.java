package br.com.hubdosaber.user.mapper;

import br.com.hubdosaber.user.dto.UserDTO;
import br.com.hubdosaber.user.model.User;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setMatriculation(user.getMatriculation());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());

        if (user.getCourse() != null) {
            UserDTO.CourseDTO courseDTO = new UserDTO.CourseDTO();
            courseDTO.setId(user.getCourse().getId());
            courseDTO.setName(user.getCourse().getName());
            dto.setCourse(courseDTO);
        }

        if (user.getDisciplineInterests() != null) {
            dto.setDisciplineInterests(
                    user.getDisciplineInterests().stream()
                            .map(userDiscipline -> {
                                UserDTO.DisciplineDTO discDto = new UserDTO.DisciplineDTO();
                                discDto.setId(userDiscipline.getDiscipline().getId());
                                discDto.setName(userDiscipline.getDiscipline().getName());
                                discDto.setCode(userDiscipline.getDiscipline().getCode());
                                return discDto;
                            })
                            .collect(Collectors.toList()));
        }

        return dto;
    }
}