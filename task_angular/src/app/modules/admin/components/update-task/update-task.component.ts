import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { AdminService } from "../../services/admin.service"

@Component({
  selector: "app-update-task",
  templateUrl: "./update-task.component.html",
  styleUrls: ["./update-task.component.css"],
})
export class UpdateTaskComponent implements OnInit {
  id: number
  updateTaskForm!: FormGroup
  listOfEmployees: any[] = []
  listOfPriorities: any[] = ["LOW", "MEDIUM", "HIGH"]
  listOfTaskStatus: any[] = ["PENDING", "INPROGRESS", "COMPLETED", "DEFERRED", "CANCELLED"]
  isLoading = false
  isSubmitting = false
  taskData: any

  constructor(
    private service: AdminService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
  ) {
    this.id = this.route.snapshot.params["id"]
  }

  ngOnInit(): void {
    this.initializeForm()
    this.loadData()
  }

  private initializeForm(): void {
    this.updateTaskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required, Validators.minLength(3)]],
      description: [null, [Validators.required, Validators.minLength(10)]],
      dueDate: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      taskStatus: [null, [Validators.required]],
    })
  }

  private loadData(): void {
    this.isLoading = true
    this.getTaskById()
    this.getUsers()
  }

  getTaskById(): void {
    this.service.getTask(this.id).subscribe({
      next: (res) => {
        this.taskData = res
        this.updateTaskForm.patchValue(res)
        console.log(res)
      },
      error: (error) => {
        this.snack.open("Failed to load task details", "Close", {
          duration: 3000,
          panelClass: ["error-snackbar"],
        })
      },
    })
  }

  getUsers(): void {
    this.service.getUsers().subscribe({
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

  updateTask(): void {
    if (this.updateTaskForm.valid) {
      this.isSubmitting = true

      this.service.updateTask(this.id, this.updateTaskForm.value).subscribe({
        next: (res) => {
          this.isSubmitting = false
          if (res.id != null) {
            this.snack.open("Task updated successfully", "Close", {
              duration: 3000,
              panelClass: ["success-snackbar"],
            })
            this.router.navigate(["/admin/dashboard"])
          } else {
            this.snack.open("Error updating task", "Close", {
              duration: 3000,
              panelClass: ["error-snackbar"],
            })
          }
        },
        error: (error) => {
          this.isSubmitting = false
          this.snack.open("Failed to update task", "Close", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          })
        },
      })
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.updateTaskForm.controls).forEach((key) => {
        this.updateTaskForm.get(key)?.markAsTouched()
      })
    }
  }

  // Helper methods for template
  get titleErrors() {
    const titleControl = this.updateTaskForm.get("title")
    if (titleControl?.errors && titleControl.touched) {
      if (titleControl.errors["required"]) return "Title is required"
      if (titleControl.errors["minlength"]) return "Title must be at least 3 characters long"
    }
    return null
  }

  get descriptionErrors() {
    const descriptionControl = this.updateTaskForm.get("description")
    if (descriptionControl?.errors && descriptionControl.touched) {
      if (descriptionControl.errors["required"]) return "Description is required"
      if (descriptionControl.errors["minlength"]) return "Description must be at least 10 characters long"
    }
    return null
  }

  get dueDateErrors() {
    const dueDateControl = this.updateTaskForm.get("dueDate")
    if (dueDateControl?.errors && dueDateControl.touched) {
      if (dueDateControl.errors["required"]) return "Due date is required"
    }
    return null
  }

  get priorityErrors() {
    const priorityControl = this.updateTaskForm.get("priority")
    if (priorityControl?.errors && priorityControl.touched) {
      if (priorityControl.errors["required"]) return "Priority is required"
    }
    return null
  }

  get taskStatusErrors() {
    const statusControl = this.updateTaskForm.get("taskStatus")
    if (statusControl?.errors && statusControl.touched) {
      if (statusControl.errors["required"]) return "Task status is required"
    }
    return null
  }

  get employeeIdErrors() {
    const employeeControl = this.updateTaskForm.get("employeeId")
    if (employeeControl?.errors && employeeControl.touched) {
      if (employeeControl.errors["required"]) return "Employee selection is required"
    }
    return null
  }
}
