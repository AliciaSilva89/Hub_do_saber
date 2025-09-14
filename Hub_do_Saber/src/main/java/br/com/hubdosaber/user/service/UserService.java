package br.com.hubdosaber.user.service;

import br.com.hubdosaber.course.model.Course;
import br.com.hubdosaber.discipline.model.Discipline;
import br.com.hubdosaber.discipline.model.UserDisciplineInterest;
import br.com.hubdosaber.course.repositoy.CourseRepository;
import br.com.hubdosaber.discipline.repository.DisciplineRepository;
import br.com.hubdosaber.discipline.repository.UserDisciplineInterestRepository;
import br.com.hubdosaber.user.request.CreateUserRequest;
import br.com.hubdosaber.user.model.User;
import br.com.hubdosaber.user.repository.UserRepository;
import br.com.hubdosaber.user.dto.UserDTO;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final DisciplineRepository disciplineRepository;
    private final UserDisciplineInterestRepository userDisciplineInterestRepository;

    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<User> findUserById(UUID id) {
        return userRepository.findById(id);
    }

    @Transactional
    public UUID createUser(CreateUserRequest request) {

        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null");
        }

        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }

        // Criar a entidade User a partir do request
        User user = new User();
        user.setMatriculation(request.getMatriculation());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Buscar e definir o curso se fornecido
        if (request.getCourseId() != null) {
            Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + request.getCourseId()));
            user.setCourse(course);
        }

        // Salvar o usuário primeiro
        User savedUser = userRepository.save(user);

        // Criar os relacionamentos com disciplinas de interesse se fornecidos
        if (request.getDisciplineInterestIds() != null && !request.getDisciplineInterestIds().isEmpty()) {
            for (UUID disciplineId : request.getDisciplineInterestIds()) {
                Discipline discipline = disciplineRepository.findById(disciplineId)
                    .orElseThrow(() -> new IllegalArgumentException("Discipline not found with id: " + disciplineId));

                UserDisciplineInterest interest = new UserDisciplineInterest();
                interest.setUser(savedUser);
                interest.setDiscipline(discipline);
                userDisciplineInterestRepository.save(interest);
            }
        }

        return savedUser.getId();
    }

    @Transactional(readOnly = true)
    public Optional<UserDTO> findUserDTOById(UUID id) {
        return userRepository.findById(id).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> findAllUsersDTO() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setMatriculation(user.getMatriculation());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());

        // Converter curso se existir
        if (user.getCourse() != null) {
            UserDTO.CourseDTO courseDTO = new UserDTO.CourseDTO();
            courseDTO.setId(user.getCourse().getId());
            courseDTO.setName(user.getCourse().getName());
            dto.setCourse(courseDTO);
        }

        // Converter disciplinas de interesse
        if (user.getDisciplineInterests() != null) {
            List<UserDTO.DisciplineDTO> disciplineDTOs = user.getDisciplineInterests().stream()
                    .map(interest -> {
                        UserDTO.DisciplineDTO disciplineDTO = new UserDTO.DisciplineDTO();
                        disciplineDTO.setId(interest.getDiscipline().getId());
                        disciplineDTO.setName(interest.getDiscipline().getName());
                        disciplineDTO.setCode(interest.getDiscipline().getCode());
                        return disciplineDTO;
                    })
                    .collect(Collectors.toList());
            dto.setDisciplineInterests(disciplineDTOs);
        }

        return dto;
    }
}