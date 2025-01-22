import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrl: './update-task.component.css'
})
  
export class UpdateTaskComponent {

  id: number;
  updateTaskForm: FormGroup;
  listOfEmployees: any[] = [];
  listOfPriorities: any[] = ["LOW", "MEDIUM", "HIGH"];
  listOfTaskStatus: any[] = ["PENDING" , "INPROGRESS" , "COMPLETED", "DEFERRED", "CANCELLED"];

  constructor(private service: AdminService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router) {
    
    this.id = this.route.snapshot.params['id'];
    this.getTaskById();
    this.getUsers();
    this.updateTaskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      taskStatus: [null, [Validators.required]]
    });
  }


  getTaskById() {
    this.service.getTask(this.id).subscribe((res) => {
      this.updateTaskForm.patchValue(res);
      console.log(res);
    })
  }

  getUsers(){
    this.service.getUsers().subscribe((res) => {
      this.listOfEmployees = res;  
      console.log(res);
    })
  }

  updateTask() {
    this.service.updateTask(this.id, this.updateTaskForm.value).subscribe((res) => {
      if (res.id != null) {
        this.snack.open('Task updated successfully', 'Close', {
          duration: 2000
        });
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.snack.open('Error updating task', 'Close', {duration: 5000});
      }
    });
  }

}
