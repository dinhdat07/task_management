import { Component, type OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth/auth.service"
import { StorageService } from "../../services/storage/storage.service"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup
  isLoading = false
  showPassword = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
    })
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true

      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false
          if (res.userId != null) {
            const user = {
              id: res.userId,
              role: res.userRole,
            }
            StorageService.saveToken(res.jwt)
            StorageService.saveUser(user)

            if (StorageService.isAdminLoggedIn()) {
              this.snackbar.open("Login successful", "Close", {
                duration: 3000,
                panelClass: ["success-snackbar"],
              })
              this.router.navigate(["/admin/dashboard"])
            } else if (StorageService.isEmployeeLoggedIn()) {
              this.snackbar.open("Login successful", "Close", {
                duration: 3000,
                panelClass: ["success-snackbar"],
              })
              this.router.navigate(["/employee/dashboard"])
            }
          } else {
            this.snackbar.open("Your email or password is not correct", "Close", {
              duration: 4000,
              panelClass: ["error-snackbar"],
            })
          }
        },
        error: (error) => {
          this.isLoading = false
          console.error("Login error:", error)
          this.snackbar.open("Login failed. Please try again.", "Close", {
            duration: 4000,
            panelClass: ["error-snackbar"],
          })
        },
      })
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched()
      })
    }
  }

  // Helper methods for template
  get emailErrors() {
    const emailControl = this.loginForm.get("email")
    if (emailControl?.errors && emailControl.touched) {
      if (emailControl.errors["required"]) return "Email is required"
      if (emailControl.errors["email"]) return "Please enter a valid email address"
    }
    return null
  }

  get passwordErrors() {
    const passwordControl = this.loginForm.get("password")
    if (passwordControl?.errors && passwordControl.touched) {
      if (passwordControl.errors["required"]) return "Password is required"
      if (passwordControl.errors["minlength"]) return "Password must be at least 8 characters long"
    }
    return null
  }
}
