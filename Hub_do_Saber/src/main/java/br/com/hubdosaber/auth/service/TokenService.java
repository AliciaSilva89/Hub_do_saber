package br.com.hubdosaber.auth.service;

import br.com.hubdosaber.config.AppUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final JwtEncoder encoder;

    public String generate(AppUserDetails user) {
        Instant now = Instant.now();
        long expirySeconds = 3600;

        var claims = JwtClaimsSet.builder()
            .issuer("hubdosaber")
            .issuedAt(now)
            .expiresAt(now.plusSeconds(expirySeconds))
            .subject(user.getId().toString()) // <-- agora sub = UUID
            .claim("roles", user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).toList())
            .build();

        // >>> IMPORTANTE: header com HS256 <<<
        var headers = JwsHeader.with(MacAlgorithm.HS256).build();

        return encoder.encode(JwtEncoderParameters.from(headers, claims))
            .getTokenValue();
    }
}
