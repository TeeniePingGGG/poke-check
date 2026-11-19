package com.pokecheck.repository;

import com.pokecheck.entity.Post;
import com.pokecheck.entity.PostLike;
import com.pokecheck.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostAndUser(Post post, User user);
    boolean existsByPostAndUser(Post post, User user);
    void deleteByPost(Post post);
}
