package br.com.hubdosaber.auth.controller;

import br.com.hubdosaber.auth.service.TokenService;
import br.com.hubdosaber.config.AppUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

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

    public record LoginRequest(String email, String password) {}
    public record TokenResponse(String access_token) {}
}
