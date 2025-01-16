package com.tudee.task_springboot.services.admin;

import com.tudee.task_springboot.dto.UserDto;

import java.util.List;

public interface AdminService {
    List<UserDto> getUsers();
}