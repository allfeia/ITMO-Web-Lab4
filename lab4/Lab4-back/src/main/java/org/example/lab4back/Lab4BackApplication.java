package org.example.lab4back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
@ComponentScan(basePackages = {"org.example.lab4back", "RESTcontrollers", "db", "repositories"})
@EnableJpaRepositories(basePackages = "repositories")
@EntityScan(basePackages = "db")
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
public class Lab4BackApplication {

    public static void main(String[] args) {
        SpringApplication.run(Lab4BackApplication.class, args);
    }

}


