package com.marketplace.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marketplace.webservices.models.Deposit;

import java.util.UUID;

@Repository
public interface DepositRepository extends JpaRepository<Deposit, UUID> {
}
