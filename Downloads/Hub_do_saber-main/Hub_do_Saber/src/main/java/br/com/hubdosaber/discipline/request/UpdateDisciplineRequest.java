package br.com.hubdosaber.discipline.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDisciplineRequest {
    private String name;
    private String description;
    private String code;
    private Integer semester;
    private UUID courseId;
    private Boolean active;
}