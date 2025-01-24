package com.tudee.task_springboot.controller.admin;

import com.tudee.task_springboot.dto.CommentDTO;
import com.tudee.task_springboot.dto.TaskDTO;
import com.tudee.task_springboot.entities.Task;
import com.tudee.task_springboot.services.admin.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }

    @PostMapping("/task")
    public ResponseEntity<TaskDTO> postTask(@RequestBody TaskDTO taskDTO) {
        TaskDTO createdTaskDTO = adminService.postTask(taskDTO);
        return ResponseEntity.status(201).body(createdTaskDTO);
    }

    @GetMapping("/tasks")
    public ResponseEntity<?> getAllTasks() {
        return ResponseEntity.ok(adminService.getAllTasks());
    }

    @DeleteMapping("/task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        adminService.deleteTask(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/task/{id}")
    public ResponseEntity<TaskDTO> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getTask(id));
    }

    @PutMapping("/task/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        TaskDTO updatedTask = adminService.updateTask(id, taskDTO);
        if (updatedTask == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updatedTask);
    }

    @GetMapping("/tasks/search")
    public ResponseEntity<?> searchTaskByTitle(@RequestParam String title) {
        return ResponseEntity.ok(adminService.searchTaskByTitle(title));
    }

    @PostMapping("/task/comment/{taskId}")
    public ResponseEntity<?> postComment(@PathVariable Long taskId, @RequestParam String content) {
        CommentDTO createdCommentDTO = adminService.postComment(taskId, content);
        return ResponseEntity.status(201).body(createdCommentDTO);
    }

    @GetMapping("/task/comments/{taskId}")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long taskId) {
        return ResponseEntity.ok(adminService.getComments(taskId));
    }



}
