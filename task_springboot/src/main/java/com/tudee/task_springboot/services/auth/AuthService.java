package com.tudee.task_springboot.services.auth;

import com.tudee.task_springboot.dto.SignUpRequest;
import com.tudee.task_springboot.dto.UserDto;

public interface AuthService {
    UserDto signupUser(SignUpRequest signUpRequest);
    boolean hasUserWithEmail(String email);

}
