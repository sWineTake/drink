package com.drink.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateCommentRequest {

    @NotNull(message = "레시피 ID는 필수입니다")
    private Long recipeId;

    @NotNull(message = "작성자 ID는 필수입니다")
    private Long authorId;

    private String authorNickname;

    @NotBlank(message = "댓글 내용은 필수입니다")
    private String content;

    private Long parentId;
}