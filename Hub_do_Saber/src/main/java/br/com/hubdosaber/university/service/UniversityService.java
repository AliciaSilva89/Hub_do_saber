package br.com.hubdosaber.university.service;

import br.com.hubdosaber.university.model.University;
import br.com.hubdosaber.university.repository.UniversityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UniversityService {

    private final UniversityRepository universityRepository;

    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    @Transactional(readOnly = true)
    public List<University> findAllUniversities() {
        return universityRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<University> findUniversityById(UUID id) {
        return universityRepository.findById(id);
    }

    @Transactional
    public University createUniversity(University university) {
        return universityRepository.save(university);
    }

    @Transactional
    public University updateUniversity(UUID id, University universityDetails) {
        return universityRepository.findById(id)
                .map(existingUniversity -> {
                    existingUniversity.setName(universityDetails.getName());
                    existingUniversity.setAcronym(universityDetails.getAcronym());
                    return universityRepository.save(existingUniversity);
                })
                .orElseThrow(() -> new RuntimeException("University not found with id " + id));
    }

    @Transactional
    public void deleteUniversity(UUID id) {
        if (!universityRepository.existsById(id)) {
            throw new RuntimeException("University not found with id " + id);
        }
        universityRepository.deleteById(id);
    }
}