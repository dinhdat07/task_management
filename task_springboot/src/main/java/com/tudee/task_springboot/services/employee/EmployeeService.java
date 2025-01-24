package com.tudee.task_springboot.services.employee;

import com.tudee.task_springboot.dto.CommentDTO;
import com.tudee.task_springboot.dto.TaskDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

public interface EmployeeService {
    List<TaskDTO> getTaskByUserId();
    List<TaskDTO> searchTaskByTitle(String title);
    TaskDTO updateTaskStatus(Long id, String taskStatus);
    TaskDTO getTask(Long id);
    List<CommentDTO> getComments(Long taskId);
    CommentDTO postComment(Long taskId, String content);
}
