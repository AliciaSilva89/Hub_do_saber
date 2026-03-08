// JpaUserDetailsService.java
package br.com.hubdosaber.config;

import br.com.hubdosaber.user.repository.UserRepository;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.DisabledException;

@Service
@RequiredArgsConstructor
public class JpaUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var u = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ✅ Bloqueia usuários desativados
        if (u.getIsActive() == null || !u.getIsActive()) {
            throw new DisabledException("Conta desativada.");
        }

        return new AppUserDetails(u.getId(), u.getEmail(), u.getPassword(), Collections.emptyList(), u.getIsActive());
    }
}
