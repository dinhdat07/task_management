package com.tudee.task_springboot.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tudee.task_springboot.dto.CommentDTO;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user.id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task.id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Task task;

    public CommentDTO getCommentDTO() {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(id);
        commentDTO.setContent(content);
        commentDTO.setCreatedAt(createdAt);
        commentDTO.setUserId(user.getId());
        commentDTO.setTaskId(task.getId());
        commentDTO.setPostedBy(user.getName());
        return commentDTO;
    }

}
