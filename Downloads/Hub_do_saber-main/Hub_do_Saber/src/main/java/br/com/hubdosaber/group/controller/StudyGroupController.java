package br.com.hubdosaber.group.controller;

import br.com.hubdosaber.group.dto.StudyGroupDTO;
import br.com.hubdosaber.group.dto.StudyGroupDetailDTO;
import br.com.hubdosaber.group.request.CreateGroupRequest;
import br.com.hubdosaber.group.request.UpdateGroupRequest;
import br.com.hubdosaber.group.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class StudyGroupController {

    @Autowired
    private GroupService groupService;

    @GetMapping
    public ResponseEntity<List<StudyGroupDTO>> getAllGroups() {
        List<StudyGroupDTO> groups = groupService.listAllGroups();
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/my-groups")
    public ResponseEntity<List<StudyGroupDTO>> getMyGroups(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        List<StudyGroupDTO> myGroups = groupService.listGroupsByUser(userDetails.getUsername());
        return ResponseEntity.ok(myGroups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyGroupDetailDTO> getGroupById(@PathVariable String id) {
        try {
            StudyGroupDetailDTO group = groupService.getGroupDetailById(id);
            return ResponseEntity.ok(group);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createGroup(
            @RequestBody CreateGroupRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            var created = groupService.createGroup(request, userDetails.getUsername());
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGroup(
            @PathVariable String id,
            @RequestBody UpdateGroupRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            groupService.updateGroup(id, request, userDetails.getUsername());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinGroup(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            groupService.joinGroup(id, userDetails.getUsername());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<?> leaveGroup(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            groupService.leaveGroup(id, userDetails.getUsername());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
