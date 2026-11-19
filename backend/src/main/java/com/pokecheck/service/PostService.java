package com.pokecheck.service;

import com.pokecheck.dto.PostCreateRequestDto;
import com.pokecheck.dto.PostResponseDto;
import com.pokecheck.dto.PostUpdateRequestDto;
import com.pokecheck.entity.Post;
import com.pokecheck.entity.PostLike;
import com.pokecheck.entity.User;
import com.pokecheck.repository.CommentRepository;
import com.pokecheck.repository.PostLikeRepository;
import com.pokecheck.repository.PostRepository;
import com.pokecheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostLikeRepository postLikeRepository;

    @Transactional(readOnly = true)
    public Page<PostResponseDto> getPosts(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(PostResponseDto::from);
    }

    @Transactional
    public PostResponseDto getPost(Long id) {
        Post post = findPostById(id);
        post.setViewCount(post.getViewCount() + 1);
        return PostResponseDto.from(post);
    }

    @Transactional
    public PostResponseDto createPost(PostCreateRequestDto dto, String loginId) {
        User author = findUserByLoginId(loginId);
        Post post = Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .author(author)
                .viewCount(0)
                .likeCount(0)
                .build();
        return PostResponseDto.from(postRepository.save(post));
    }

    @Transactional
    public PostResponseDto updatePost(Long id, PostUpdateRequestDto dto, String loginId) {
        Post post = findPostById(id);
        checkAuthor(post, loginId);
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        return PostResponseDto.from(post);
    }

    @Transactional
    public void deletePost(Long id, String loginId) {
        Post post = findPostById(id);
        checkAuthor(post, loginId);
        commentRepository.deleteAll(commentRepository.findByPostOrderByCreatedAtAsc(post));
        postLikeRepository.deleteByPost(post);
        postRepository.delete(post);
    }

    @Transactional
    public Map<String, Object> likePost(Long postId, String loginId) {
        Post post = findPostById(postId);
        User user = findUserByLoginId(loginId);

        boolean liked;
        var existing = postLikeRepository.findByPostAndUser(post, user);
        if (existing.isPresent()) {
            postLikeRepository.delete(existing.get());
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            liked = false;
        } else {
            postLikeRepository.save(PostLike.builder().post(post).user(user).build());
            post.setLikeCount(post.getLikeCount() + 1);
            liked = true;
        }
        return Map.of("likeCount", post.getLikeCount(), "liked", liked);
    }

    private Post findPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다. id=" + id));
    }

    private User findUserByLoginId(String loginId) {
        return userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    }

    private void checkAuthor(Post post, String loginId) {
        if (!post.getAuthor().getLoginId().equals(loginId)) {
            throw new AccessDeniedException("게시글 작성자만 수정/삭제할 수 있습니다.");
        }
    }
}
