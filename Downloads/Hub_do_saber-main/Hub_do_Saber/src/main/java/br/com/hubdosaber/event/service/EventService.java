package br.com.hubdosaber.event.service;

import br.com.hubdosaber.event.dto.EventDTO;
import br.com.hubdosaber.event.model.Event;
import br.com.hubdosaber.event.repository.EventRepository;
import br.com.hubdosaber.event.request.CreateEventRequest;
import br.com.hubdosaber.user.model.User;
import br.com.hubdosaber.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Transactional
    public EventDTO createEvent(UUID userId, CreateEventRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setType(request.getType());
        event.setEventDate(request.getEventDate());
        event.setEventTime(request.getEventTime());
        event.setLink(request.getLink());
        event.setUser(user);

        Event savedEvent = eventRepository.save(event);
        return toDTO(savedEvent);
    }

    @Transactional(readOnly = true)
    public List<EventDTO> getUserEvents(UUID userId) {
        return eventRepository.findByUserIdOrderByEventDateAscEventTimeAsc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteEvent(UUID eventId, UUID userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (!event.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only delete your own events");
        }

        eventRepository.delete(event);
    }

    private EventDTO toDTO(Event event) {
        return new EventDTO(
                event.getId(),
                event.getTitle(),
                event.getType(),
                event.getEventDate(),
                event.getEventTime(),
                event.getLink());
    }
}