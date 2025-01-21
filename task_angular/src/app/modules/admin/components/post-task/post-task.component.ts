import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-task',
  templateUrl: './post-task.component.html',
  styleUrl: './post-task.component.css'
})
export class PostTaskComponent {

  taskForm!: FormGroup;
  listOfEmployees: any[] = [];
  listOfPriorities: any[] = ["LOW", "MEDIUM", "HIGH"];
  listOfTaskStatus: any[] = ["PENDING" , "INPROGRESS" , "COMPLETED", "DEFERRED", "CANCELLED"];

  constructor(private adminService: AdminService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.getUsers();
    this.taskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      priority: [null, [Validators.required]]
    });
  }
  
  getUsers(){
    this.adminService.getUsers().subscribe((res) => {
      this.listOfEmployees = res;  
      console.log(res);
    })
  }

  postTask() {
    console.log(this.taskForm.value);
    this.adminService.postTask(this.taskForm.value).subscribe((res) => {
      if (res.id != null) {
        this.snack.open('Task created successfully', 'Close', {
          duration: 2000
        });
        this.taskForm.reset();
        this.router.navigate(['/admin/dashboard']);
      } else {
          this.snack.open('Error creating task', 'Close', {duration: 5000});
        }
      });
  }


}
