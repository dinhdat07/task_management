package com.tudee.task_springboot.services.admin;

import com.tudee.task_springboot.dto.TaskDTO;
import com.tudee.task_springboot.dto.UserDto;
import com.tudee.task_springboot.entities.Task;
import com.tudee.task_springboot.entities.User;
import com.tudee.task_springboot.enums.UserRole;
import com.tudee.task_springboot.repositories.TaskRepository;
import com.tudee.task_springboot.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public List<UserDto> getUsers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getUserRole() == UserRole.EMPLOYEE)
                .map(User::getUserDTO)
                .collect(Collectors.toList());

    }

    @Override
    public Task postTask(TaskDTO taskDTO) {
        User user = userRepository.findById(taskDTO.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setPriority(taskDTO.getPriority());
        task.setTaskStatus(taskDTO.getTaskStatus());
        task.setUser(user);

        return taskRepository.save(task);
    }

    @Override
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(Task::getTaskDTO)
                .collect(Collectors.toList());
    }


}
