package com.drink.recipe.dto;

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
public class RecipeDto {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String difficulty;
    private String imageUrl;
    private Long authorId;
    private List<String> ingredients;
    private List<String> steps;
    private List<String> tags;
    private LocalDateTime createdAt;
}