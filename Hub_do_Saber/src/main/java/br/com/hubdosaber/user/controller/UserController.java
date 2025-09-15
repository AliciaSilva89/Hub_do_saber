package br.com.hubdosaber.user.controller;


import br.com.hubdosaber.user.dto.UserDTO;
import br.com.hubdosaber.user.model.User;
import br.com.hubdosaber.user.repository.UserRepository;
import br.com.hubdosaber.user.request.CreateUserRequest;
import br.com.hubdosaber.user.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UUID> createUser(@RequestBody CreateUserRequest request) {
        UUID userId = userService.createUser(request);
        return new ResponseEntity<>(userId, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.findAllUsersDTO();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable("id") UUID id) {
        Optional<UserDTO> user = userService.findUserDTOById(id);
        return user.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal Jwt principal) {
        String userId = principal.getSubject();
        UUID id = UUID.fromString(userId);
        Optional<UserDTO> user = userService.findUserDTOById(id);
        return user.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

}