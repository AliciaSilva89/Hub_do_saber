package br.com.hubdosaber;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "br.com.hubdosaber")
public class HubDoSaberApplication {

	public static void main(String[] args) {
		SpringApplication.run(HubDoSaberApplication.class, args);
	}

}