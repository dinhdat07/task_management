package com.tudee.task_springboot.repositories;

import com.tudee.task_springboot.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByTitleContaining(String title);
    List<Task> findAllByUserId(Long id);
    List<Task> findAllByTitleContainingAndUserId(String title, Long id);
}
