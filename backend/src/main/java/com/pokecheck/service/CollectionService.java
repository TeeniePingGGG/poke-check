package com.pokecheck.service;

import com.pokecheck.dto.CollectionRequestDto;
import com.pokecheck.dto.CollectionResponseDto;
import com.pokecheck.entity.Collection;
import com.pokecheck.entity.User;
import com.pokecheck.repository.CollectionRepository;
import com.pokecheck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CollectionResponseDto> getMyCollection(String loginId) {
        User user = findUser(loginId);
        return collectionRepository.findByUser(user)
                .stream()
                .map(CollectionResponseDto::from)
                .toList();
    }

    @Transactional
    public CollectionResponseDto addItem(CollectionRequestDto dto, String loginId) {
        User user = findUser(loginId);
        if (collectionRepository.existsByUserAndItemId(user, dto.getItemId())) {
            throw new IllegalArgumentException("이미 컬렉션에 추가된 아이템입니다.");
        }
        Collection item = Collection.builder()
                .user(user)
                .itemType(dto.getItemType())
                .itemId(dto.getItemId())
                .itemName(dto.getItemName())
                .build();
        return CollectionResponseDto.from(collectionRepository.save(item));
    }

    @Transactional
    public void removeItem(Long id, String loginId) {
        Collection item = collectionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("아이템을 찾을 수 없습니다."));
        if (!item.getUser().getLoginId().equals(loginId)) {
            throw new AccessDeniedException("본인의 컬렉션만 삭제할 수 있습니다.");
        }
        collectionRepository.delete(item);
    }

    private User findUser(String loginId) {
        return userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    }
}
