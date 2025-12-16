package br.com.hubdosaber.university.repository;

import br.com.hubdosaber.university.model.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UniversityRepository extends JpaRepository<University, UUID> {
    Optional<University> findByNameIgnoreCase(String name);

    Optional<University> findByAcronymIgnoreCase(String acronym);
}