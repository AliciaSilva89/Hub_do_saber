package br.com.hubdosaber.event.dto;

import br.com.hubdosaber.event.model.EventType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private UUID id;
    private String title;
    private EventType type;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String link;
}