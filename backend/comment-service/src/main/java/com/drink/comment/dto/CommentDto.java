package com.drink.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
    private Long id;
    private Long recipeId;
    private Long authorId;
    private String authorNickname;
    private String content;
    private Long parentId;
    private List<CommentDto> replies;
    private LocalDateTime createdAt;
}