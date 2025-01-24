package com.tudee.task_springboot.services.admin;

import com.tudee.task_springboot.dto.CommentDTO;
import com.tudee.task_springboot.dto.TaskDTO;
import com.tudee.task_springboot.dto.UserDto;
import com.tudee.task_springboot.entities.Comment;
import com.tudee.task_springboot.entities.Task;
import com.tudee.task_springboot.entities.User;
import com.tudee.task_springboot.enums.TaskStatus;
import com.tudee.task_springboot.enums.UserRole;
import com.tudee.task_springboot.repositories.CommentRepository;
import com.tudee.task_springboot.repositories.TaskRepository;
import com.tudee.task_springboot.repositories.UserRepository;
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
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final JwtUtil jwtUtil;

    public List<UserDto> getUsers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getUserRole() == UserRole.EMPLOYEE)
                .map(User::getUserDTO)
                .collect(Collectors.toList());

    }

    @Override
    public TaskDTO postTask(TaskDTO taskDTO) {
        User user = userRepository.findById(taskDTO.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setPriority(taskDTO.getPriority());
        task.setTaskStatus(taskDTO.getTaskStatus());
        task.setUser(user);

        taskRepository.save(task);
        return task.getTaskDTO();
    }

    @Override
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(Task::getTaskDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Override
    public TaskDTO getTask(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.map(Task::getTaskDTO).orElse(null);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            Task existingTask = optionalTask.get();
            existingTask.setTitle(taskDTO.getTitle());
            existingTask.setDescription(taskDTO.getDescription());
            existingTask.setPriority(taskDTO.getPriority());
            existingTask.setDueDate(taskDTO.getDueDate());
            existingTask.setTaskStatus(mapStringToTaskStatus(String.valueOf(taskDTO.getTaskStatus())));
            User user = userRepository.findById(taskDTO.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("User to update not found"));
            existingTask.setUser(user);
            return taskRepository.save(existingTask).getTaskDTO();
        }
        return null;
    }

    @Override
    public List<TaskDTO> searchTaskByTitle(String title) {
        return taskRepository.findAllByTitleContaining(title)
                .stream()
                .sorted(Comparator.comparing(Task::getDueDate).reversed())
                .map(Task::getTaskDTO)
                .collect(Collectors.toList());
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
