package com.tudee.task_springboot.controller.auth;

import com.tudee.task_springboot.dto.AuthenticationRequest;
import com.tudee.task_springboot.dto.AuthenticationResponse;
import com.tudee.task_springboot.dto.SignUpRequest;
import com.tudee.task_springboot.dto.UserDto;
import com.tudee.task_springboot.entities.User;
import com.tudee.task_springboot.repositories.UserRepository;
import com.tudee.task_springboot.services.auth.AuthService;
import com.tudee.task_springboot.services.jwt.UserService;
import com.tudee.task_springboot.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {
    private final AuthService authService;

    private final UserRepository userRepository;

    public final JwtUtil jwtUtil;

    private final UserService userService;

    private final AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody SignUpRequest signUpRequest){
        if (authService.hasUserWithEmail(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("User already exist with this email");

        }
        UserDto createdUserDto = authService.signupUser(signUpRequest);
        if (createdUserDto == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not created");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdUserDto);
    }

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getEmail(),
                    authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            AuthenticationResponse badResponse = new AuthenticationResponse();
            badResponse.setJwt(null);
            badResponse.setUserId(null);
            badResponse.setUserRole(null);
            return badResponse;
        }

        final UserDetails userDetails = userService.userDetailService().loadUserByUsername(authenticationRequest.getEmail());
        Optional<User> optionalUser = userRepository.findFirstByEmail(authenticationRequest.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);

        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        authenticationResponse.setJwt(jwtToken);
        authenticationResponse.setUserId(optionalUser.get().getId());
        authenticationResponse.setUserRole(optionalUser.get().getUserRole());
        return authenticationResponse;
    }



}
