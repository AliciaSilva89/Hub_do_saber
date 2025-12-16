package br.com.hubdosaber.user.controller;

import br.com.hubdosaber.user.dto.UserDTO;
import br.com.hubdosaber.user.request.CreateUserRequest;
import br.com.hubdosaber.user.request.UpdateUserRequest;
import br.com.hubdosaber.user.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import br.com.hubdosaber.config.GlobalExceptionHandler;
import org.springframework.security.access.prepost.PreAuthorize; 
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UUID> createUser(@RequestBody CreateUserRequest request) {
        UUID userId = userService.createUser(request);
        return new ResponseEntity<>(userId, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping

    public ResponseEntity<Page<UserDTO>> getAllUsers(Pageable pageable) {
        Page<UserDTO> users = userService.findPagedUsersDTO(pageable);
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
        UUID id = UUID.fromString(principal.getSubject());
        Optional<UserDTO> user = userService.findUserDTOById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(@RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal Jwt principal) {
        UUID id = UUID.fromString(principal.getSubject());
        UserDTO updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deactivateCurrentUser(@AuthenticationPrincipal Jwt principal) {
        UUID id = UUID.fromString(principal.getSubject());
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }
}