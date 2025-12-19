package br.com.hubdosaber.event.request;

import br.com.hubdosaber.event.model.EventType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateEventRequest {
    private String title;
    private EventType type;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String link;
}