import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  listOfTasks: any[] = [];
  constructor(private adminService: AdminService,
  private snackBar: MatSnackBar) {
    this.getTasks();
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



}