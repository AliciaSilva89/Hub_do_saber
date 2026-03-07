package br.com.hubdosaber.university.service;

import br.com.hubdosaber.university.dto.UniversityDTO;
import br.com.hubdosaber.university.mapper.UniversityMapper;
import br.com.hubdosaber.university.model.University;
import br.com.hubdosaber.university.repository.UniversityRepository;
import br.com.hubdosaber.university.request.CreateUniversityRequest;
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
    private final UniversityMapper universityMapper;

    @Transactional
    public UUID createUniversity(CreateUniversityRequest request) {
        
        if (universityRepository.findByNameIgnoreCase(request.getName()).isPresent()) {
            throw new IllegalArgumentException("University name already exists.");
        }
        if (universityRepository.findByAcronymIgnoreCase(request.getAcronym()).isPresent()) {
            throw new IllegalArgumentException("University acronym already exists.");
        }

        University university = universityMapper.toEntity(request);
        University savedUniversity = universityRepository.save(university);
        return savedUniversity.getId();
    }

    @Transactional(readOnly = true)
    public Optional<UniversityDTO> findUniversityDTOById(UUID id) {
        return universityRepository.findById(id).map(universityMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<UniversityDTO> findAllUniversities() {
        return universityRepository.findAll()
                .stream()
                .map(universityMapper::toDTO)
                .toList();
    }
}