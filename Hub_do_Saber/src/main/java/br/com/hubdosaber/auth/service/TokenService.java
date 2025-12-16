package br.com.hubdosaber.auth.service;

import br.com.hubdosaber.config.AppUserDetails;
import org.springframework.beans.factory.annotation.Value; // MANTIDO: Necessário para injetar valores de propriedades
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenService {

        private final JwtEncoder encoder;

        private final long tokenExpirationSeconds; 

        public TokenService(
                        JwtEncoder encoder,
                        @Value("${jwt.token.expiration-time-seconds}") long tokenExpirationSeconds 
                                                                                                   
                                                                                                   
        ) {
                this.encoder = encoder;
                this.tokenExpirationSeconds = tokenExpirationSeconds;
        }

        public String generate(AppUserDetails user) {
                Instant now = Instant.now();

                var claims = JwtClaimsSet.builder()
                                .issuer("hubdosaber")
                                .issuedAt(now)
                                .expiresAt(now.plusSeconds(tokenExpirationSeconds))
                                .subject(user.getId().toString()) // UUID do usuário
                                .claim("roles", user.getAuthorities().stream()
                                                .map(GrantedAuthority::getAuthority).toList())
                                .build();

                var headers = JwsHeader.with(MacAlgorithm.HS256).build();

                return encoder.encode(JwtEncoderParameters.from(headers, claims))
                                .getTokenValue();
        }
}