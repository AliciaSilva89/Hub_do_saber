package br.com.hubdosaber.auth.controller;

import br.com.hubdosaber.auth.service.TokenService;
import br.com.hubdosaber.config.AppUserDetails;
import br.com.hubdosaber.user.dto.UserDTO;
import br.com.hubdosaber.user.request.UpdateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081") 
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    // Record para a requisição de login. Corresponde aos dados do front-end.
    public record LoginRequest(String email, String password) {}
    
    // Record para a resposta do token. O front-end espera `access_token`.
    public record TokenResponse(String access_token) {}

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );
        var principal = (UserDetails) auth.getPrincipal();
        var appUser = (principal instanceof AppUserDetails) ? (AppUserDetails) principal
            : new AppUserDetails(null, principal.getUsername(), principal.getPassword(),
                principal.getAuthorities(), principal.isEnabled());

        String jwt = tokenService.generate(appUser);
        return ResponseEntity.ok(new TokenResponse(jwt));
    }

}