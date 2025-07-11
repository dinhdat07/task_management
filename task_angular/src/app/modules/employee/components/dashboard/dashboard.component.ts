import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { EmployeeService } from "../../services/employee.service"

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  listOfTasks: any[] = []
  filteredTasks: any[] = []
  searchForm!: FormGroup
  isLoading = false
  searchQuery = ""

  // Task statistics
  taskStats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  }

  constructor(
    private service: EmployeeService,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
  ) {
    this.searchForm = this.formBuilder.group({
      title: [""],
    })
  }

  ngOnInit(): void {
    this.getTasks()
  }

  getTasks(): void {
    this.isLoading = true
    this.service.getTasksByEmployeeId().subscribe({
      next: (res) => {
        this.listOfTasks = res
        this.filteredTasks = res
        this.calculateStats()
        this.isLoading = false
        console.log(this.listOfTasks)
      },
      error: (error) => {
        this.isLoading = false
        this.snackbar.open("Failed to load tasks", "Close", {
          duration: 3000,
          panelClass: ["error-snackbar"],
        })
      },
    })
  }

  searchTasks(): void {
    const title = this.searchForm.value.title?.toLowerCase() || ""
    this.searchQuery = title

    if (title.trim() === "") {
      this.filteredTasks = this.listOfTasks
    } else {
      this.filteredTasks = this.listOfTasks.filter(
        (task) => task.title.toLowerCase().includes(title) || task.description.toLowerCase().includes(title),
      )
    }
  }

  updateTaskStatus(id: number, status: string): void {
    this.service.updateTaskStatus(id, status).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackbar.open("Task status updated successfully", "Close", {
            duration: 3000,
            panelClass: ["success-snackbar"],
          })
          this.getTasks()
        } else {
          this.snackbar.open("Task status update failed", "Close", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          })
        }
      },
      error: (error) => {
        this.snackbar.open("Failed to update task status", "Close", {
          duration: 3000,
          panelClass: ["error-snackbar"],
        })
      },
    })
  }

  private calculateStats(): void {
    this.taskStats.total = this.listOfTasks.length
    this.taskStats.pending = this.listOfTasks.filter((task) => task.taskStatus === "PENDING").length
    this.taskStats.inProgress = this.listOfTasks.filter((task) => task.taskStatus === "INPROGRESS").length
    this.taskStats.completed = this.listOfTasks.filter((task) => task.taskStatus === "COMPLETED").length
  }

  getPriorityColor(priority: string): string {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "INPROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "PENDING":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      case "INPROGRESS":
        return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      case "PENDING":
        return "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      default:
        return "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      case "MEDIUM":
        return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      case "LOW":
        return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      default:
        return "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }
  }
}
