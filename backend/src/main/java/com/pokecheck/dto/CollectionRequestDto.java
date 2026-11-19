package com.pokecheck.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CollectionRequestDto {

    private String itemType;
    private String itemId;
    private String itemName;
}
