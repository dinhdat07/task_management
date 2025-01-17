package com.tudee.task_springboot.controller.admin;

import com.tudee.task_springboot.dto.TaskDTO;
import com.tudee.task_springboot.entities.Task;
import com.tudee.task_springboot.services.admin.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        Task createdTask = adminService.postTask(taskDTO);
        TaskDTO createdTaskDTO = createdTask.getTaskDTO();
        return ResponseEntity.status(201).body(createdTaskDTO);
    }

    @GetMapping("/tasks")
    public ResponseEntity<?> getAllTasks() {
        return ResponseEntity.ok(adminService.getAllTasks());
    }
}
