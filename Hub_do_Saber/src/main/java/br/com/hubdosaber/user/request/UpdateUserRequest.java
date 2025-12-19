package br.com.hubdosaber.user.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    private String name;
    private String email;
    private String matriculation;
    private String profilePicture;
}