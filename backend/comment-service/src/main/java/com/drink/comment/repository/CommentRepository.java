package com.drink.comment.repository;

import com.drink.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByRecipeIdOrderByCreatedAtDesc(Long recipeId);
    List<Comment> findByAuthorId(Long authorId);
    List<Comment> findByParentId(Long parentId);
    long countByRecipeId(Long recipeId);
}