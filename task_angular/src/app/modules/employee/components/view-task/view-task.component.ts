import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css'
})
  
export class ViewTaskComponent {
  taskId: number;
  taskData: any;
  commentForm!: FormGroup;
  listOfComments: any;
  constructor(private service: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.taskId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.getTask();
    this.getComments();
    this.commentForm = this.fb.group({
      content: [null, Validators.required]
    });
  }

  getTask() {
    this.service.getTask(this.taskId).subscribe((res) => {
      this.taskData = res;
    });
  }

  getComments() {
    this.service.getComments(this.taskId).subscribe((res) => {
      this.listOfComments = res;
    });
  }

  postComment() {
    this.service.postComment(this.taskId, this.commentForm.get("content")?.value).subscribe((res) => {
      if (res.id != null) {
        this.getComments();
        this.commentForm.reset();
        this.snackBar.open('Comment posted successfully', 'Close', {
          duration: 2000,
        });
      } else {
        this.snackBar.open('Error while posting comment', 'Close', {
          duration: 2000,
        });
      }
    });
  }


}
