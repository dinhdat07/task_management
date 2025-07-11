import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute } from "@angular/router"
import { MatSnackBar } from "@angular/material/snack-bar"
import { AdminService } from "../../services/admin.service"

@Component({
  selector: "app-view-task",
  templateUrl: "./view-task.component.html",
  styleUrls: ["./view-task.component.css"],
})
export class ViewTaskComponent implements OnInit {
  taskId: number
  taskData: any
  commentForm!: FormGroup
  listOfComments: any[] = []
  isLoading = false
  isSubmittingComment = false

  constructor(
    private service: AdminService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.taskId = this.activatedRoute.snapshot.params["id"]
  }

  ngOnInit(): void {
    this.initializeForm()
    this.loadTaskData()
  }

  private initializeForm(): void {
    this.commentForm = this.fb.group({
      content: [null, [Validators.required, Validators.minLength(3)]],
    })
  }

  private loadTaskData(): void {
    this.isLoading = true
    this.getTask()
    this.getComments()
  }

  getTask(): void {
    this.service.getTask(this.taskId).subscribe({
      next: (res) => {
        this.taskData = res
        this.isLoading = false
      },
      error: (error) => {
        this.isLoading = false
        this.snackBar.open("Failed to load task details", "Close", {
          duration: 3000,
          panelClass: ["error-snackbar"],
        })
      },
    })
  }

  getComments(): void {
    this.service.getComments(this.taskId).subscribe({
      next: (res) => {
        this.listOfComments = res
      },
      error: (error) => {
        this.snackBar.open("Failed to load comments", "Close", {
          duration: 3000,
          panelClass: ["error-snackbar"],
        })
      },
    })
  }

  postComment(): void {
    if (this.commentForm.valid) {
      this.isSubmittingComment = true
      const content = this.commentForm.get("content")?.value

      this.service.postComment(this.taskId, content).subscribe({
        next: (res) => {
          this.isSubmittingComment = false
          if (res.id != null) {
            this.getComments()
            this.commentForm.reset()
            this.snackBar.open("Comment posted successfully", "Close", {
              duration: 3000,
              panelClass: ["success-snackbar"],
            })
          } else {
            this.snackBar.open("Error while posting comment", "Close", {
              duration: 3000,
              panelClass: ["error-snackbar"],
            })
          }
        },
        error: (error) => {
          this.isSubmittingComment = false
          this.snackBar.open("Failed to post comment", "Close", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          })
        },
      })
    }
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
      case "DEFERRED":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200"
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
      case "DEFERRED":
        return "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      case "CANCELLED":
        return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
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

  get contentErrors() {
    const contentControl = this.commentForm.get("content")
    if (contentControl?.errors && contentControl.touched) {
      if (contentControl.errors["required"]) return "Comment is required"
      if (contentControl.errors["minlength"]) return "Comment must be at least 3 characters long"
    }
    return null
  }
}
