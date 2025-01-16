package com.tudee.task_springboot.repositories;

import com.tudee.task_springboot.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

}
