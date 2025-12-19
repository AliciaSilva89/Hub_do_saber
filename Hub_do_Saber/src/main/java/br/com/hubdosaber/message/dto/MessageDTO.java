package br.com.hubdosaber.message.dto;

import br.com.hubdosaber.message.model.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private UUID id;
    private UUID userId;
    private String userName;
    private String userAvatar;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private String profilePicture; // ✅ JÁ EXISTE

    public MessageDTO(Message message) {
        this.id = message.getId();
        this.userId = message.getUser().getId();
        this.userName = message.getUser().getName();
        this.userAvatar = getInitials(message.getUser().getName());
        this.content = message.getContent();
        this.imageUrl = message.getImageUrl();
        this.createdAt = message.getCreatedAt();
        this.profilePicture = message.getUser().getProfilePicture(); // ✅ ADICIONAR ESTA LINHA
    }

    private String getInitials(String name) {
        if (name == null || name.trim().isEmpty())
            return "U";
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) {
            return parts[0].substring(0, 1).toUpperCase() +
                    parts[1].substring(0, 1).toUpperCase();
        }
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }
}
