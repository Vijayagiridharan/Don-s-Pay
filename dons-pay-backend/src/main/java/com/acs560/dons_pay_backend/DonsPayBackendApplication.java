package com.acs560.dons_pay_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication (exclude = {DataSourceAutoConfiguration.class})
public class DonsPayBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(DonsPayBackendApplication.class, args);
	}

}
