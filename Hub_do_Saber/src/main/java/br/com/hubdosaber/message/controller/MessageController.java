// MessageController.java
package br.com.hubdosaber.message.controller;

import br.com.hubdosaber.message.dto.MessageDTO;
import br.com.hubdosaber.message.request.CreateMessageRequest;
import br.com.hubdosaber.message.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/messages")
@AllArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable String groupId) {
        List<MessageDTO> messages = messageService.getMessagesByGroup(groupId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(
            @PathVariable String groupId,
            @RequestBody CreateMessageRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        MessageDTO message = messageService.sendMessage(groupId, request, userId);
        return ResponseEntity.ok(message);
    }
}
