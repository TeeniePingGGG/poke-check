package com.pokecheck.dto;

import com.pokecheck.entity.Collection;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CollectionResponseDto {

    private Long id;
    private String itemType;
    private String itemId;
    private String itemName;
    private LocalDateTime addedAt;

    public static CollectionResponseDto from(Collection c) {
        return CollectionResponseDto.builder()
                .id(c.getId())
                .itemType(c.getItemType())
                .itemId(c.getItemId())
                .itemName(c.getItemName())
                .addedAt(c.getAddedAt())
                .build();
    }
}
