package br.com.hubdosaber.event.controller;

import br.com.hubdosaber.event.dto.EventDTO;
import br.com.hubdosaber.event.request.CreateEventRequest;
import br.com.hubdosaber.event.service.EventService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDTO>> getUserEvents(@AuthenticationPrincipal Jwt principal) {
        UUID userId = UUID.fromString(principal.getSubject());
        List<EventDTO> events = eventService.getUserEvents(userId);
        return ResponseEntity.ok(events);
    }

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(
            @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal Jwt principal) {
        UUID userId = UUID.fromString(principal.getSubject());
        EventDTO event = eventService.createEvent(userId, request);
        return ResponseEntity.ok(event);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt principal) {
        UUID userId = UUID.fromString(principal.getSubject());
        eventService.deleteEvent(id, userId);
        return ResponseEntity.noContent().build();
    }
}