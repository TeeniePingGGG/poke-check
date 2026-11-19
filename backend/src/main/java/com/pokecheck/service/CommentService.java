package com.pokecheck.service;

import com.pokecheck.dto.CommentCreateRequestDto;
import com.pokecheck.dto.CommentResponseDto;
import com.pokecheck.dto.CommentUpdateRequestDto;
import com.pokecheck.entity.Comment;
import com.pokecheck.entity.Post;
import com.pokecheck.entity.User;
import com.pokecheck.repository.CommentRepository;
import com.pokecheck.repository.PostRepository;
import com.pokecheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CommentResponseDto> getComments(Long postId) {
        Post post = findPostById(postId);
        return commentRepository.findByPostOrderByCreatedAtAsc(post)
                .stream()
                .map(CommentResponseDto::from)
                .toList();
    }

    @Transactional
    public CommentResponseDto createComment(Long postId, CommentCreateRequestDto dto, String loginId) {
        Post post = findPostById(postId);
        User author = findUserByLoginId(loginId);
        Comment comment = Comment.builder()
                .content(dto.getContent())
                .author(author)
                .post(post)
                .build();
        return CommentResponseDto.from(commentRepository.save(comment));
    }

    @Transactional
    public CommentResponseDto updateComment(Long id, CommentUpdateRequestDto dto, String loginId) {
        Comment comment = findCommentById(id);
        checkAuthor(comment, loginId);
        comment.setContent(dto.getContent());
        return CommentResponseDto.from(comment);
    }

    @Transactional
    public void deleteComment(Long id, String loginId) {
        Comment comment = findCommentById(id);
        checkAuthor(comment, loginId);
        commentRepository.delete(comment);
    }

    private Post findPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. id=" + postId));
    }

    private Comment findCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다. id=" + id));
    }

    private User findUserByLoginId(String loginId) {
        return userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    }

    private void checkAuthor(Comment comment, String loginId) {
        if (!comment.getAuthor().getLoginId().equals(loginId)) {
            throw new AccessDeniedException("댓글 작성자만 수정/삭제할 수 있습니다.");
        }
    }
}
