// filepath: src/main/java/cc/suvankar/website/SecurityConfig.java
package cc.suvankar.website;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.*;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity)
        throws Exception {
        httpSecurity
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/",
                    "/images/**",
                    "/css/**",
                    "/js/**",
                    "/Suvankar_Mitra_Resume_India.pdf",
                    "/favicon.ico",
                    "/robots.txt"
                ).permitAll()
                .anyRequest().denyAll()
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .csrf(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            throw new org.springframework.security.core.userdetails
                .UsernameNotFoundException("No user accounts configured");
        };
    }
}
