package com.pokecheck.repository;

import com.pokecheck.entity.Comment;
import com.pokecheck.entity.Post;
import com.pokecheck.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByPostOrderByCreatedAtAsc(Post post);

    List<Comment> findByAuthor(User author);

    long countByPost(Post post);
}
