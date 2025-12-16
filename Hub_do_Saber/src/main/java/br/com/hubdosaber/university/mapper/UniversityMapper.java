package br.com.hubdosaber.university.mapper;

import br.com.hubdosaber.university.dto.UniversityDTO;
import br.com.hubdosaber.university.model.University;
import br.com.hubdosaber.university.request.CreateUniversityRequest;

import org.springframework.stereotype.Component;

@Component
public class UniversityMapper {

    public UniversityDTO toDTO(University university) {
        return new UniversityDTO(
                university.getId(),
                university.getName(),
                university.getAcronym());
    }

    public University toEntity(CreateUniversityRequest request) {
        University university = new University();
        university.setName(request.getName());
        university.setAcronym(request.getAcronym());
        return university;
    }
}