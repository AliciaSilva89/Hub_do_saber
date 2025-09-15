package br.com.hubdosaber.group.controller;

import br.com.hubdosaber.group.model.StudyGroup;
import br.com.hubdosaber.group.request.CreateGroupRequest;
import br.com.hubdosaber.group.service.GroupService;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/group")
@AllArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @PostMapping
    public ResponseEntity<UUID> createGroup(@RequestBody CreateGroupRequest createGroupRequest, @AuthenticationPrincipal Jwt principal) {
        String userId = principal.getSubject();
        StudyGroup savedStudyGroup = groupService.createGroup(createGroupRequest, userId);
        return ResponseEntity.ok(savedStudyGroup.getId());
    }

    @PostMapping("/join")
    public ResponseEntity<?> joinGroup(@RequestParam("groupId") String groupId, @AuthenticationPrincipal Jwt principal) {
        String userId = principal.getSubject();
        groupService.joinGroup(groupId, userId);
        return ResponseEntity.ok().build();
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

    @GetMapping("/{id}")
    public ResponseEntity<?> getGroupById(@PathVariable("id") String groupId){
        return ResponseEntity.ok(groupService.getGroupDetailById(groupId));
    }
}
