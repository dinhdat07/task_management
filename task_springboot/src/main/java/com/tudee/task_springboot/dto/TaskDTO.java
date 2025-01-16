package com.tudee.task_springboot.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tudee.task_springboot.entities.User;
import com.tudee.task_springboot.enums.TaskStatus;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Data
public class TaskDTO {
    private Long id;

    private String title;

    private String description;

    private Date dueDate;

    private String priority;

    private TaskStatus taskStatus;

    private Long employeeId;

    private String employeeName;
}
