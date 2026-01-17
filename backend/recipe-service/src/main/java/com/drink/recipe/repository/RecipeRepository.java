package com.drink.recipe.repository;

import com.drink.recipe.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByCategory(String category);
    List<Recipe> findByAuthorId(Long authorId);
    List<Recipe> findByTitleContainingIgnoreCase(String keyword);
}