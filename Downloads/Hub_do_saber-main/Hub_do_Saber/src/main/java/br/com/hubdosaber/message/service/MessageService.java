package br.com.hubdosaber.message.service;

import br.com.hubdosaber.group.model.StudyGroup;
import br.com.hubdosaber.group.repository.GroupRepository;
import br.com.hubdosaber.message.dto.MessageDTO;
import br.com.hubdosaber.message.model.Message;
import br.com.hubdosaber.message.repository.MessageRepository;
import br.com.hubdosaber.message.request.CreateMessageRequest;
import br.com.hubdosaber.user.model.User;
import br.com.hubdosaber.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Transactional
    public MessageDTO sendMessage(String groupId, CreateMessageRequest request, String userId) {
        Objects.requireNonNull(groupId, "Group id is required");
        Objects.requireNonNull(userId, "User id is required");

        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        StudyGroup group = groupRepository.findById(UUID.fromString(groupId))
                .orElseThrow(() -> new RuntimeException("Group not found with id: " + groupId));

        Message message = new Message();
        message.setGroup(group);
        message.setUser(user);
        message.setContent(request.getContent());
        message.setImageUrl(request.getImageUrl());

        Message savedMessage = messageRepository.save(message);
        return new MessageDTO(savedMessage);
    }

    public List<MessageDTO> getMessagesByGroup(String groupId) {
        Objects.requireNonNull(groupId, "Group id is required");

        return messageRepository.findByGroupIdWithDetails(UUID.fromString(groupId))
                .stream()
                .map(MessageDTO::new)
                .collect(Collectors.toList());
    }
}
