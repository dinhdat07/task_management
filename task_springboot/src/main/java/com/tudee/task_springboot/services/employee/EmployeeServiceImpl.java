package com.tudee.task_springboot.services.employee;

import com.tudee.task_springboot.dto.CommentDTO;
import com.tudee.task_springboot.dto.TaskDTO;
import com.tudee.task_springboot.entities.Comment;
import com.tudee.task_springboot.entities.Task;
import com.tudee.task_springboot.entities.User;
import com.tudee.task_springboot.enums.TaskStatus;
import com.tudee.task_springboot.repositories.CommentRepository;
import com.tudee.task_springboot.repositories.TaskRepository;
import com.tudee.task_springboot.utils.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService{
    private final TaskRepository taskRepository;
    private final JwtUtil jwtUtil;
    private final CommentRepository commentRepository;

    @Override
    public List<TaskDTO> getTaskByUserId() {
        User user = jwtUtil.getLoggedInUser();
        if (user != null) {
            return taskRepository.findAllByUserId(user.getId())
                    .stream()
                    .sorted(Comparator.comparing(Task::getDueDate).reversed())
                    .map(Task::getTaskDTO)
                    .collect(Collectors.toList());
        }
        throw new EntityNotFoundException("User not found");
    }

    @Override
    public List<TaskDTO> searchTaskByTitle(String title) {
        User user = jwtUtil.getLoggedInUser();
        if (user != null) {
            return taskRepository.findAllByTitleContainingAndUserId(title, user.getId())
                    .stream()
                    .sorted(Comparator.comparing(Task::getDueDate).reversed())
                    .map(Task::getTaskDTO)
                    .collect(Collectors.toList());
        }
        throw new EntityNotFoundException("User not found");
    }


    @Override
    public TaskDTO updateTaskStatus(Long id, String taskStatus) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task existingTask = optionalTask.get();
            existingTask.setTaskStatus(mapStringToTaskStatus(String.valueOf(taskStatus)));
            return taskRepository.save(existingTask).getTaskDTO();
        }
        return null;
    }

    @Override
    public TaskDTO getTask(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.map(Task::getTaskDTO).orElse(null);
    }

    @Override
    public List<CommentDTO> getComments(Long taskId) {
        return commentRepository.findAllByTaskId(taskId)
                .stream()
                .sorted(Comparator.comparing(Comment::getCreatedAt).reversed())
                .map(Comment::getCommentDTO)
                .collect(Collectors.toList());
    }


    public CommentDTO postComment(Long taskId, String content) {
        User user = jwtUtil.getLoggedInUser();
        Optional<Task> optionalTask = taskRepository.findById(taskId);

        if (optionalTask.isPresent() && user != null) {
            Comment comment = new Comment();
            comment.setTask(optionalTask.get());
            comment.setUser(user);
            comment.setCreatedAt(new Date());
            comment.setContent(content);
            commentRepository.save(comment);
            return comment.getCommentDTO();
        }

        throw new EntityNotFoundException("User or Task not found");
    }


    private TaskStatus mapStringToTaskStatus(String status) {
        return switch (status) {
            case "PENDING" -> TaskStatus.PENDING;
            case "INPROGRESS" -> TaskStatus.INPROGRESS;
            case "COMPLETED" -> TaskStatus.COMPLETED;
            case "DEFERRED" -> TaskStatus.DEFERRED;
            default -> TaskStatus.CANCELLED;
        };
    }

}
