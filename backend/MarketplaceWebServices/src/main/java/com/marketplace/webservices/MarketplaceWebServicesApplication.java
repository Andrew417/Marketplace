package com.marketplace.webservices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MarketplaceWebServicesApplication {

	public static void main(String[] args) {
    SpringApplication.run(MarketplaceWebServicesApplication.class, args);
    System.out.println("Marketplace Web Services Started on port: " + 
        System.getProperty("server.port", "8080"));
	}

}
