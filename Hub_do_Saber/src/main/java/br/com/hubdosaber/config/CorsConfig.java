// CorsConfig.java
package br.com.hubdosaber.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Permitir credenciais (cookies, headers de autenticação)
        config.setAllowCredentials(true);

        // ✅ Permitir origens do frontend (adicione todas as portas que você usa)
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:8081",
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:8081",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:3000"));

        // ✅ Permitir todos os headers
        config.setAllowedHeaders(Arrays.asList("*"));

        // ✅ Permitir todos os métodos HTTP
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // ✅ Expor o header Authorization na resposta
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // ✅ Cache da configuração CORS por 1 hora
        config.setMaxAge(3600L);

        // ✅ Aplicar configuração para todas as rotas da API
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
