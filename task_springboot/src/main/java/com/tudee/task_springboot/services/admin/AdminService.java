package com.tudee.task_springboot.services.admin;

import com.tudee.task_springboot.dto.TaskDTO;
import com.tudee.task_springboot.dto.UserDto;
import com.tudee.task_springboot.entities.Task;

import java.util.List;

public interface AdminService {
    List<UserDto> getUsers();
    Task postTask(TaskDTO taskDTO);
    List<TaskDTO> getAllTasks();
}