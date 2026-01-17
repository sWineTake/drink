package com.drink.recipe.service;

import com.drink.recipe.dto.CreateRecipeRequest;
import com.drink.recipe.dto.RecipeDto;
import com.drink.recipe.entity.Recipe;
import com.drink.recipe.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public List<RecipeDto> getAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public RecipeDto getRecipeById(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다: " + id));
        return toDto(recipe);
    }

    public List<RecipeDto> getRecipesByCategory(String category) {
        return recipeRepository.findByCategory(category).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<RecipeDto> searchRecipes(String keyword) {
        return recipeRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RecipeDto createRecipe(CreateRecipeRequest request) {
        Recipe recipe = Recipe.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .difficulty(request.getDifficulty())
                .imageUrl(request.getImageUrl())
                .authorId(request.getAuthorId())
                .ingredients(new ArrayList<>(request.getIngredients()))
                .steps(new ArrayList<>(request.getSteps()))
                .tags(request.getTags() != null ? new ArrayList<>(request.getTags()) : new ArrayList<>())
                .build();

        return toDto(recipeRepository.save(recipe));
    }

    @Transactional
    public RecipeDto updateRecipe(Long id, CreateRecipeRequest request) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("레시피를 찾을 수 없습니다: " + id));

        recipe.setTitle(request.getTitle());
        recipe.setDescription(request.getDescription());
        recipe.setCategory(request.getCategory());
        recipe.setDifficulty(request.getDifficulty());
        recipe.setImageUrl(request.getImageUrl());
        recipe.setIngredients(new ArrayList<>(request.getIngredients()));
        recipe.setSteps(new ArrayList<>(request.getSteps()));
        recipe.setTags(request.getTags() != null ? new ArrayList<>(request.getTags()) : new ArrayList<>());

        return toDto(recipe);
    }

    @Transactional
    public void deleteRecipe(Long id) {
        if (!recipeRepository.existsById(id)) {
            throw new RuntimeException("레시피를 찾을 수 없습니다: " + id);
        }
        recipeRepository.deleteById(id);
    }

    private RecipeDto toDto(Recipe recipe) {
        return RecipeDto.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .category(recipe.getCategory())
                .difficulty(recipe.getDifficulty())
                .imageUrl(recipe.getImageUrl())
                .authorId(recipe.getAuthorId())
                .ingredients(recipe.getIngredients())
                .steps(recipe.getSteps())
                .tags(recipe.getTags())
                .createdAt(recipe.getCreatedAt())
                .build();
    }
}