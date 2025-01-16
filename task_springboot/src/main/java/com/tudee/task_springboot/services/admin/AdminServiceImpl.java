package com.tudee.task_springboot.services.admin;

import com.tudee.task_springboot.dto.UserDto;
import com.tudee.task_springboot.entities.User;
import com.tudee.task_springboot.enums.UserRole;
import com.tudee.task_springboot.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;

    public List<UserDto> getUsers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getUserRole() == UserRole.EMPLOYEE)
                .map(User::getUserDto)
                .collect(Collectors.toList());

    }
}
