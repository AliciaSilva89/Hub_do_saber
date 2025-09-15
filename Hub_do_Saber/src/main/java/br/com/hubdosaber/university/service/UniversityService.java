package br.com.hubdosaber.university.service;

import br.com.hubdosaber.university.dto.UniversityDTO;
import br.com.hubdosaber.university.model.University;
import br.com.hubdosaber.university.repository.UniversityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UniversityService {

    private final UniversityRepository universityRepository;

    public List<UniversityDTO> findAllUniversities() {
        return universityRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    private UniversityDTO convertToDTO(University university) {
        return new UniversityDTO(
                university.getId(),
                university.getName(),
                university.getAcronym()
        );
    }
}