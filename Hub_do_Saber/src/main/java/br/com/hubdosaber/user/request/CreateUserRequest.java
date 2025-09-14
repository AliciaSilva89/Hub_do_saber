package br.com.hubdosaber.user.request;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CreateUserRequest {
    private String matriculation;
    private String password;
    private String name;
    private String email;
    private UUID courseId;
    private List<UUID> disciplineInterestIds;
}
