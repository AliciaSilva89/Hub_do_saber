package br.com.hubdosaber.feedback.service;

import br.com.hubdosaber.feedback.dto.FeedbackDTO;
import br.com.hubdosaber.feedback.model.Feedback;
import br.com.hubdosaber.feedback.repository.FeedbackRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository repo;

    public FeedbackService(FeedbackRepository repo) {
        this.repo = repo;
    }

    public List<FeedbackDTO> getAll() {
        return repo.findAllByOrderByCreatedAtDesc().stream()
                .map(f -> new FeedbackDTO(
                        f.getId(), f.getUserId(), f.getAuthorName(),
                        f.getCourseName(), f.getRating(), f.getComment(),
                        f.getCreatedAt().toString(),
                        f.getProfilePicture())) 
                .toList();
    }

    public FeedbackDTO create(FeedbackDTO dto) {
        Feedback f = new Feedback();
        f.setUserId(dto.userId());
        f.setAuthorName(dto.authorName());
        f.setCourseName(dto.courseName());
        f.setRating(dto.rating());
        f.setComment(dto.comment());
        f.setProfilePicture(dto.profilePicture());
        Feedback saved = repo.save(f);
        return new FeedbackDTO(
                saved.getId(), saved.getUserId(), saved.getAuthorName(),
                saved.getCourseName(), saved.getRating(), saved.getComment(),
                saved.getCreatedAt().toString(),
                saved.getProfilePicture()); 
    }
}
