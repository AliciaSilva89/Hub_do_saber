package br.com.hubdosaber.group.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class UpdateGroupRequest {
    private String name;
    private String description;
    private Integer maxMembers; 
    private Boolean monitoring; 
    private Boolean active; 
    private UUID disciplineId;
}