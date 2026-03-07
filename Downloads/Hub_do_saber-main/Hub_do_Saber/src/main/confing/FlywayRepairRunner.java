package br.com.hubdosaber.config;

import org.flywaydb.core.Flyway;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class FlywayRepairRunner implements CommandLineRunner {

    private final Flyway flyway;

    public FlywayRepairRunner(Flyway flyway) {
        this.flyway = flyway;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Executando Flyway repair...");
        flyway.repair();
        System.out.println("Flyway repair concluído com sucesso!");
        System.out.println("LEMBRE-SE: Delete esta classe agora!");
    }
}