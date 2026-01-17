package com.drink.recipe.controller;

import com.drink.recipe.dto.CreateRecipeRequest;
import com.drink.recipe.dto.RecipeDto;
import com.drink.recipe.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping
    public ResponseEntity<List<RecipeDto>> getAllRecipes() {
        return ResponseEntity.ok(recipeService.getAllRecipes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDto> getRecipeById(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<RecipeDto>> getRecipesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(recipeService.getRecipesByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipeDto>> searchRecipes(@RequestParam String keyword) {
        return ResponseEntity.ok(recipeService.searchRecipes(keyword));
    }

    @PostMapping
    public ResponseEntity<RecipeDto> createRecipe(@Valid @RequestBody CreateRecipeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recipeService.createRecipe(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeDto> updateRecipe(
            @PathVariable Long id,
            @Valid @RequestBody CreateRecipeRequest request) {
        return ResponseEntity.ok(recipeService.updateRecipe(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }
}