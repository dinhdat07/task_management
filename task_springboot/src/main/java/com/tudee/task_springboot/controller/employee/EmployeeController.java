package com.tudee.task_springboot.controller.employee;

import com.tudee.task_springboot.dto.TaskDTO;
import com.tudee.task_springboot.services.employee.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/employee")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDTO>> getTaskByUserId() {
        return ResponseEntity.ok(employeeService.getTaskByUserId());
    }

    @GetMapping("/tasks/search")
    public ResponseEntity<List<TaskDTO>> searchTaskByTitle(@RequestParam String title) {
        return ResponseEntity.ok(employeeService.searchTaskByTitle(title));
    }

    @PutMapping("/task/{id}/{taskStatus}")
    public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Long id, @PathVariable String taskStatus) {
        TaskDTO updatedTask = employeeService.updateTaskStatus(id, taskStatus);
        if (updatedTask == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updatedTask);
    }


}
