package br.com.hubdosaber.group.request;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CreateGroupRequest {

    private String name;
    private String description;
    private int maxMembers;
    private boolean monitoring;
    private UUID disciplineId;
}
