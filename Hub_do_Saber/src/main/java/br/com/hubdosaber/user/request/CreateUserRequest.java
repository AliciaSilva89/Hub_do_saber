package br.com.hubdosaber.user.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserRequest {
    private String matriculation;
    private String password;
    private String name;
    private String email;
    private String courseName;
}