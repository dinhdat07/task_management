package com.tudee.task_springboot.dto;

import com.tudee.task_springboot.enums.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private Long id;

    private String name;

    private String email;

    private String password;

    private UserRole userRole;
}
