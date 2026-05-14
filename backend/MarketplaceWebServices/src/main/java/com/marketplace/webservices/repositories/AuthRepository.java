package com.marketplace.webservices.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.marketplace.webservices.models.User;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Modifying
    @Query("UPDATE User u SET u.failedAttempts = u.failedAttempts + 1 WHERE u.userId = :id")
    void incrementFailedAttempts(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE User u SET u.status = 'LOCKED', u.lockTime = :lockTime WHERE u.userId = :id")
    void lockAccount(@Param("id") UUID id, @Param("lockTime") OffsetDateTime lockTime);

    @Modifying
    @Query("UPDATE User u SET u.failedAttempts = 0, u.status = 'ACTIVE', u.lockTime = NULL WHERE u.userId = :id")
    void resetFailedAttempts(@Param("id") UUID id);
}
