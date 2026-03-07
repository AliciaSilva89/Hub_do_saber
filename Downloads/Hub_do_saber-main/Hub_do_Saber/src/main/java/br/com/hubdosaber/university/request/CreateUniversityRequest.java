package br.com.hubdosaber.university.request;

import lombok.Data;

@Data
public class CreateUniversityRequest {
    private String name;
    private String acronym;
}