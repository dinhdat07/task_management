package com.tudee.task_springboot.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tudee.task_springboot.dto.TaskDTO;
import com.tudee.task_springboot.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;


@Entity
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private Date dueDate;

    private String priority;

    private TaskStatus taskStatus;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user.id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private User user;

    public TaskDTO getTaskDTO() {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle(title);
        taskDTO.setId(id);
        taskDTO.setDueDate(dueDate);
        taskDTO.setTaskStatus(taskStatus);
        taskDTO.setDescription(description);
        taskDTO.setPriority(priority);
        taskDTO.setEmployeeId(user.getId());
        taskDTO.setEmployeeName(user.getName());
        return taskDTO;
    }

}
