package br.com.hubdosaber.user.service;

import br.com.hubdosaber.course.model.Course;
import br.com.hubdosaber.course.repositoy.CourseRepository;
import br.com.hubdosaber.user.request.CreateUserRequest;
import br.com.hubdosaber.user.request.UpdateUserRequest;
import br.com.hubdosaber.user.model.User;
import br.com.hubdosaber.user.repository.UserRepository;
import br.com.hubdosaber.user.dto.UserDTO;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        User user = new User();
        user.setMatriculation(request.getMatriculation());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        if (request.getCourseName() != null && !request.getCourseName().isEmpty()) {
            Course course = courseRepository.findByNameIgnoreCase(request.getCourseName())
                .orElseThrow(() -> new IllegalArgumentException("Course not found with name: " + request.getCourseName()));
            user.setCourse(course);
        }

        User savedUser = userRepository.save(user);

        return savedUser.getId();
    }


    @Transactional
    public UserDTO updateUser(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getMatriculation() != null) {
            user.setMatriculation(request.getMatriculation());
        }
        
        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
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
        
        if (user.getCourse() != null) {
            UserDTO.CourseDTO courseDTO = new UserDTO.CourseDTO();
            courseDTO.setId(user.getCourse().getId());
            courseDTO.setName(user.getCourse().getName());
            dto.setCourse(courseDTO);
        }
        return dto;
    }
}