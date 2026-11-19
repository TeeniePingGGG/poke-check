package com.pokecheck.repository;

import com.pokecheck.entity.Collection;
import com.pokecheck.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CollectionRepository extends JpaRepository<Collection, Long> {

    List<Collection> findByUser(User user);

    List<Collection> findByUserAndItemType(User user, String itemType);

    Optional<Collection> findByUserAndItemId(User user, String itemId);

    boolean existsByUserAndItemId(User user, String itemId);
}
