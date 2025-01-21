import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  listOfTasks: any[] = [];
  searchForm!: FormGroup;
  
  constructor(private adminService: AdminService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder) {
    this.getTasks();
    this.searchForm = this.formBuilder.group({
      title: ['']
    });
  }

  getTasks() {
    this.adminService.getAllTasks().subscribe((res) => {
      this.listOfTasks = res;
    })
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.adminService.deleteTask(id).subscribe(() => {
        this.getTasks();
        this.snackBar.open('Task deleted successfully', 'Close', {duration: 2000});
      });
    }
  }

  searchTasks() {
    this.listOfTasks = [];
    const title = this.searchForm.value.title;
    this.adminService.searchTasks(title).subscribe((res) => {
      this.listOfTasks = res;
    });
  }



}