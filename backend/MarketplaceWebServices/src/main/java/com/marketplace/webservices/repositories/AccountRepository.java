package com.marketplace.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.marketplace.webservices.models.Account;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

    Optional<Account> findByUserId(UUID userId);

    @Modifying
    @Transactional
    @Query("UPDATE Account a SET a.balance = a.balance + :amount, a.updatedAt = CURRENT_INSTANT WHERE a.userId = :userId")
    void addToBalance(@Param("userId") UUID userId, @Param("amount") BigDecimal amount);
}
