package br.com.hubdosaber.user.service;

import br.com.hubdosaber.course.model.Course;
import br.com.hubdosaber.course.repositoy.CourseRepository;
import br.com.hubdosaber.user.dto.UserDTO;
import br.com.hubdosaber.user.mapper.UserMapper;
import br.com.hubdosaber.user.model.User;
import br.com.hubdosaber.user.repository.UserRepository;
import br.com.hubdosaber.user.request.CreateUserRequest;
import br.com.hubdosaber.user.request.UpdateUserRequest;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Collections;
import java.util.stream.Collectors;

import br.com.hubdosaber.config.AppUserDetails;

@Service
@AllArgsConstructor
public class UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final UserMapper userMapper;

    @Transactional
    public UUID createUser(CreateUserRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use.");
        }

        User user = new User();
        user.setMatriculation(request.getMatriculation());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setIsActive(true);

        if (request.getCourseName() != null && !request.getCourseName().isEmpty()) {
            Course course = courseRepository.findByNameIgnoreCase(request.getCourseName())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Course not found with name: " + request.getCourseName()));
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

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already in use by another user.");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getMatriculation() != null && !request.getMatriculation().equals(user.getMatriculation())) {
        
            user.setMatriculation(request.getMatriculation());
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }

    @Transactional
    public void deactivateUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        if (user.getIsActive()) {
            user.setIsActive(false);
            userRepository.save(user);
        }
    }

    @Transactional(readOnly = true)
    public Page<UserDTO> findPagedUsersDTO(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Optional<UserDTO> findUserDTOById(UUID id) {
        return userRepository.findById(id).map(userMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> findAllUsersDTO() {
    
        return userRepository.findAll().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AppUserDetails loadAppUserDetailsById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        return new AppUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                Collections.emptyList(),
                user.getIsActive() != null ? user.getIsActive() : true
        );
    }
}