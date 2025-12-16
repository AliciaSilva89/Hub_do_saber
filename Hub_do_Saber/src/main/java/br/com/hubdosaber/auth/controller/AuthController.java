package br.com.hubdosaber.auth.controller;

import br.com.hubdosaber.auth.request.LoginRequest;
import br.com.hubdosaber.auth.response.TokenResponse;
import br.com.hubdosaber.auth.service.TokenService;
import br.com.hubdosaber.config.AppUserDetails; 
import br.com.hubdosaber.user.request.CreateUserRequest;
import br.com.hubdosaber.user.service.UserService;
import lombok.RequiredArgsConstructor; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID; 

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));

        
        AppUserDetails principal = (AppUserDetails) auth.getPrincipal();

        String jwt = tokenService.generate(principal);
        return ResponseEntity.ok(new TokenResponse(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<TokenResponse> signUp(@RequestBody CreateUserRequest request) {

        UUID userId = userService.createUser(request);

    
        AppUserDetails principal = userService.loadAppUserDetailsById(userId);

        String jwt = tokenService.generate(principal);

        return new ResponseEntity<>(new TokenResponse(jwt), HttpStatus.CREATED);
    }
}