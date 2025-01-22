import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  listOfTasks: any[] = [];
  searchForm!: FormGroup;

  constructor(private service: EmployeeService,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    this.getTasks();
    this.searchForm = this.formBuilder.group({
      title: ['']
    });
  }
  
  getTasks() {
    this.service.getTasksByEmployeeId().subscribe((res) => {
      this.listOfTasks = res;
      console.log(this.listOfTasks);
    });
  }

  searchTasks() {
    this.listOfTasks = [];
    const title = this.searchForm.value.title;
    this.service.searchTasks(title).subscribe((res) => {
      this.listOfTasks = res;
    });
  }

  updateTaskStatus(id: number, status: string) {
    this.service.updateTaskStatus(id, status).subscribe((res) => {
      if (res.id != null) {
        this.snackbar.open('Task status updated successfully', 'Close', { duration: 2000 });
        this.getTasks();
      } else {
        this.snackbar.open('Task status update failed', 'Close', { duration: 2000 });
      }
    });
  }

}
