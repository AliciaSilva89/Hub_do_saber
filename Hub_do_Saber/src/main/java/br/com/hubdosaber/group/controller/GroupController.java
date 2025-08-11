package br.com.hubdosaber.group.controller;

import br.com.hubdosaber.group.model.StudyGroup;
import br.com.hubdosaber.group.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/group")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping
    public ResponseEntity<StudyGroup> createGroup(@RequestBody StudyGroup studyGroup, @AuthenticationPrincipal Jwt principal) {
        String userId = principal.getSubject();
        StudyGroup savedStudyGroup = groupService.createGroup(studyGroup, userId);
        return ResponseEntity.ok(savedStudyGroup);
    }

    @GetMapping
    public ResponseEntity<?> listGroups(@RequestParam(value = "mygroup", required = false) Boolean myGroup,
                                        @AuthenticationPrincipal Jwt principal) {
        String userId = principal.getSubject();
        if (Boolean.TRUE.equals(myGroup)) {
            return ResponseEntity.ok(groupService.listGroupsByUser(userId));
        } else {
            return ResponseEntity.ok(groupService.listAllGroups());
        }
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinGroup(@RequestParam("groupId") String groupId, @AuthenticationPrincipal Jwt principal) {
        String userId = principal.getSubject();
        groupService.joinGroup(groupId, userId);
        return ResponseEntity.ok().build();
    }
}
