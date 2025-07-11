import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { AdminService } from "../../services/admin.service"

@Component({
  selector: "app-post-task",
  templateUrl: "./post-task.component.html",
  styleUrls: ["./post-task.component.css"],
})
export class PostTaskComponent implements OnInit {
  taskForm!: FormGroup
  listOfEmployees: any[] = []
  listOfPriorities: any[] = ["LOW", "MEDIUM", "HIGH"]
  listOfTaskStatus: any[] = ["PENDING", "INPROGRESS", "COMPLETED", "DEFERRED", "CANCELLED"]
  isLoading = false
  isSubmitting = false

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initializeForm()
    this.getUsers()
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required, Validators.minLength(3)]],
      description: [null, [Validators.required, Validators.minLength(10)]],
      dueDate: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      taskStatus: ["PENDING", [Validators.required]],
    })
  }

  getUsers(): void {
    this.isLoading = true
    this.adminService.getUsers().subscribe({
      next: (res) => {
        this.listOfEmployees = res
        this.isLoading = false
        console.log(res)
      },
      error: (error) => {
        this.isLoading = false
        this.snack.open("Failed to load employees", "Close", {
          duration: 3000,
          panelClass: ["error-snackbar"],
        })
      },
    })
  }

  postTask(): void {
    if (this.taskForm.valid) {
      this.isSubmitting = true
      console.log(this.taskForm.value)

      this.adminService.postTask(this.taskForm.value).subscribe({
        next: (res) => {
          this.isSubmitting = false
          if (res.id != null) {
            this.snack.open("Task created successfully", "Close", {
              duration: 3000,
              panelClass: ["success-snackbar"],
            })
            this.taskForm.reset()
            this.taskForm.patchValue({ taskStatus: "PENDING" })
            this.router.navigate(["/admin/dashboard"])
          } else {
            this.snack.open("Error creating task", "Close", {
              duration: 3000,
              panelClass: ["error-snackbar"],
            })
          }
        },
        error: (error) => {
          this.isSubmitting = false
          this.snack.open("Failed to create task", "Close", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          })
        },
      })
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.taskForm.controls).forEach((key) => {
        this.taskForm.get(key)?.markAsTouched()
      })
    }
  }

  // Helper methods for template
  get titleErrors() {
    const titleControl = this.taskForm.get("title")
    if (titleControl?.errors && titleControl.touched) {
      if (titleControl.errors["required"]) return "Title is required"
      if (titleControl.errors["minlength"]) return "Title must be at least 3 characters long"
    }
    return null
  }

  get descriptionErrors() {
    const descriptionControl = this.taskForm.get("description")
    if (descriptionControl?.errors && descriptionControl.touched) {
      if (descriptionControl.errors["required"]) return "Description is required"
      if (descriptionControl.errors["minlength"]) return "Description must be at least 10 characters long"
    }
    return null
  }

  get dueDateErrors() {
    const dueDateControl = this.taskForm.get("dueDate")
    if (dueDateControl?.errors && dueDateControl.touched) {
      if (dueDateControl.errors["required"]) return "Due date is required"
    }
    return null
  }

  get priorityErrors() {
    const priorityControl = this.taskForm.get("priority")
    if (priorityControl?.errors && priorityControl.touched) {
      if (priorityControl.errors["required"]) return "Priority is required"
    }
    return null
  }

  get taskStatusErrors() {
    const statusControl = this.taskForm.get("taskStatus")
    if (statusControl?.errors && statusControl.touched) {
      if (statusControl.errors["required"]) return "Task status is required"
    }
    return null
  }

  get employeeIdErrors() {
    const employeeControl = this.taskForm.get("employeeId")
    if (employeeControl?.errors && employeeControl.touched) {
      if (employeeControl.errors["required"]) return "Employee selection is required"
    }
    return null
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case "HIGH":
        return "text-red-600 bg-red-50 border-red-200"
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "LOW":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-50 border-green-200"
      case "INPROGRESS":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "PENDING":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "DEFERRED":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "CANCELLED":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }
}
