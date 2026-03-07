package br.com.hubdosaber.feedback.dto;

import java.util.UUID;

public record FeedbackDTO(
                Long id,
                UUID userId, 
                String authorName,
                String courseName,
                Integer rating,
                String comment,
                String createdAt) {
}
