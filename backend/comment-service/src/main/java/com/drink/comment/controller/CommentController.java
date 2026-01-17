package com.drink.comment.controller;

import com.drink.comment.dto.CommentDto;
import com.drink.comment.dto.CreateCommentRequest;
import com.drink.comment.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<CommentDto>> getCommentsByRecipeId(@PathVariable Long recipeId) {
        return ResponseEntity.ok(commentService.getCommentsByRecipeId(recipeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getCommentById(id));
    }

    @GetMapping("/recipe/{recipeId}/count")
    public ResponseEntity<Map<String, Long>> getCommentCount(@PathVariable Long recipeId) {
        long count = commentService.getCommentCountByRecipeId(recipeId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PostMapping
    public ResponseEntity<CommentDto> createComment(@Valid @RequestBody CreateCommentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.createComment(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentDto> updateComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(commentService.updateComment(id, request.get("content")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}