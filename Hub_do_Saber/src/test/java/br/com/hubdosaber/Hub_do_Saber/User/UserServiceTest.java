package br.com.hubdosaber.Hub_do_Saber.User;

import br.com.hubdosaber.user.model.User;
import br.com.hubdosaber.user.repository.UserRepository;
import br.com.hubdosaber.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;
    private UUID testUserId;

    @BeforeEach
    void setUp() {
        testUserId = UUID.randomUUID();
        testUser = new User();
        testUser.setId(testUserId);
        testUser.setMatriculation("12345");
        testUser.setName("Teste User");
        testUser.setEmail("teste@example.com");
        testUser.setPassword("password123");
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setCourseId(UUID.randomUUID());
        testUser.setProfileId(1);
    }

    @Test
    @DisplayName("Should find all users")
    void shouldFindAllUsers() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser, new User()));

        List<User> users = userService.findAllUsers();

        assertNotNull(users);
        assertEquals(2, users.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should find user by ID when exists")
    void shouldFindUserByIdWhenExists() {
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));

        Optional<User> foundUser = userService.findUserById(testUserId);

        assertTrue(foundUser.isPresent());
        assertEquals(testUser.getName(), foundUser.get().getName());
        verify(userRepository, times(1)).findById(testUserId);
    }

    @Test
    @DisplayName("Should not find user by ID when not exists")
    void shouldNotFindUserByIdWhenNotExists() {
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        Optional<User> foundUser = userService.findUserById(UUID.randomUUID());

        assertFalse(foundUser.isPresent());
        verify(userRepository, times(1)).findById(any(UUID.class));
    }

    @Test
    @DisplayName("Should create a new user")
    void shouldCreateUser() {
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User createdUser = userService.createUser(testUser);

        assertNotNull(createdUser);
        assertEquals(testUser.getName(), createdUser.getName());
        assertNotNull(createdUser.getCreatedAt());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should update an existing user")
    void shouldUpdateUser() {
        User updatedDetails = new User();
        updatedDetails.setName("Novo Nome");
        updatedDetails.setEmail("novo@example.com");
        updatedDetails.setMatriculation("98765");

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User result = userService.updateUser(testUserId, updatedDetails);

        assertNotNull(result);
        assertEquals("Novo Nome", result.getName());
        assertEquals("novo@example.com", result.getEmail());
        assertEquals("98765", result.getMatriculation());
        verify(userRepository, times(1)).findById(testUserId);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    @DisplayName("Should throw exception when updating non-existent user")
    void shouldThrowExceptionWhenUpdatingNonExistentUser() {
        when(userRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        UUID nonExistentUserId = UUID.randomUUID();

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                userService.updateUser(nonExistentUserId, new User()));

        assertEquals("User not found with id " + nonExistentUserId, exception.getMessage());

        verify(userRepository, times(1)).findById(nonExistentUserId);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should delete an existing user")
    void shouldDeleteUser() {
        when(userRepository.existsById(testUserId)).thenReturn(true);
        doNothing().when(userRepository).deleteById(testUserId);

        userService.deleteUser(testUserId);

        verify(userRepository, times(1)).existsById(testUserId);
        verify(userRepository, times(1)).deleteById(testUserId);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent user")
    void shouldThrowExceptionWhenDeletingNonExistentUser() {
        when(userRepository.existsById(any(UUID.class))).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                userService.deleteUser(UUID.randomUUID()));

        assertTrue(exception.getMessage().startsWith("User not found with id "));
        verify(userRepository, times(1)).existsById(any(UUID.class));
        verify(userRepository, never()).deleteById(any(UUID.class));
    }
}