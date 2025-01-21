package com.tudee.task_springboot.services.admin;

import com.tudee.task_springboot.dto.TaskDTO;
import com.tudee.task_springboot.dto.UserDto;

import java.util.List;

public interface AdminService {
    List<UserDto> getUsers();
    TaskDTO postTask(TaskDTO taskDTO);
    List<TaskDTO> getAllTasks();
    void deleteTask(Long id);
    TaskDTO getTask(Long id);
    TaskDTO updateTask(Long id, TaskDTO taskDTO);
    List<TaskDTO> searchTaskByTitle(String title);
}