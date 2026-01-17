package com.drink.recipe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateRecipeRequest {

    @NotBlank(message = "제목은 필수입니다")
    private String title;

    private String description;

    private String category;

    private String difficulty;

    private String imageUrl;

    private Long authorId;

    @NotEmpty(message = "재료는 최소 1개 이상 필요합니다")
    private List<String> ingredients;

    @NotEmpty(message = "조리 단계는 최소 1개 이상 필요합니다")
    private List<String> steps;

    private List<String> tags;
}