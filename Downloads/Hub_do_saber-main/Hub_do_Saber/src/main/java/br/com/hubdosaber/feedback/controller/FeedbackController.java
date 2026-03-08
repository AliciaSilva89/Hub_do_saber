package br.com.hubdosaber.feedback.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.hubdosaber.feedback.dto.FeedbackDTO;
import br.com.hubdosaber.feedback.service.FeedbackService;
import java.util.List;

@RestController
@RequestMapping("/feedbacks")
public class FeedbackController {

    private final FeedbackService service;

    public FeedbackController(FeedbackService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<FeedbackDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<FeedbackDTO> create(@RequestBody FeedbackDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }
}
