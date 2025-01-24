package com.tudee.task_springboot.repositories;

import com.tudee.task_springboot.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByTaskId(Long taskId);
}
