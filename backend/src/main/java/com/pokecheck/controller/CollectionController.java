package com.pokecheck.controller;

import com.pokecheck.dto.CollectionRequestDto;
import com.pokecheck.dto.CollectionResponseDto;
import com.pokecheck.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/collection")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping
    public ResponseEntity<List<CollectionResponseDto>> getMyCollection(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(collectionService.getMyCollection(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<?> addItem(@RequestBody CollectionRequestDto dto,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(collectionService.addItem(dto, userDetails.getUsername()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeItem(@PathVariable Long id,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        try {
            collectionService.removeItem(id, userDetails.getUsername());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        }
    }
}
