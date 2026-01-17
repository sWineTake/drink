package com.drink.comment.service;

import com.drink.comment.dto.CommentDto;
import com.drink.comment.dto.CreateCommentRequest;
import com.drink.comment.entity.Comment;
import com.drink.comment.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;

    public List<CommentDto> getCommentsByRecipeId(Long recipeId) {
        List<Comment> comments = commentRepository.findByRecipeIdOrderByCreatedAtDesc(recipeId);

        // 부모 댓글만 필터링
        List<CommentDto> parentComments = comments.stream()
                .filter(c -> c.getParentId() == null)
                .map(this::toDto)
                .collect(Collectors.toList());

        // 각 부모 댓글에 대댓글 추가
        parentComments.forEach(parent -> {
            List<CommentDto> replies = comments.stream()
                    .filter(c -> parent.getId().equals(c.getParentId()))
                    .map(this::toDto)
                    .collect(Collectors.toList());
            parent.setReplies(replies);
        });

        return parentComments;
    }

    public CommentDto getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다: " + id));
        return toDto(comment);
    }

    public long getCommentCountByRecipeId(Long recipeId) {
        return commentRepository.countByRecipeId(recipeId);
    }

    @Transactional
    public CommentDto createComment(CreateCommentRequest request) {
        Comment comment = Comment.builder()
                .recipeId(request.getRecipeId())
                .authorId(request.getAuthorId())
                .authorNickname(request.getAuthorNickname())
                .content(request.getContent())
                .parentId(request.getParentId())
                .build();

        return toDto(commentRepository.save(comment));
    }

    @Transactional
    public CommentDto updateComment(Long id, String content) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다: " + id));

        comment.setContent(content);
        return toDto(comment);
    }

    @Transactional
    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new RuntimeException("댓글을 찾을 수 없습니다: " + id);
        }
        // 대댓글도 함께 삭제
        List<Comment> replies = commentRepository.findByParentId(id);
        commentRepository.deleteAll(replies);
        commentRepository.deleteById(id);
    }

    private CommentDto toDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .recipeId(comment.getRecipeId())
                .authorId(comment.getAuthorId())
                .authorNickname(comment.getAuthorNickname())
                .content(comment.getContent())
                .parentId(comment.getParentId())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}