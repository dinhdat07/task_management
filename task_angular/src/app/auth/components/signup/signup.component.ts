import { Component, type OnInit } from "@angular/core"
import { FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth/auth.service"

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  signUpForm!: FormGroup
  showPassword = false
  showConfirmPassword = false
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router,
  ) {
    this.signUpForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      const password = this.signUpForm.get("password")?.value
      const confirmPassword = this.signUpForm.get("confirmPassword")?.value

      if (password !== confirmPassword) {
        this.snackbar.open("Passwords do not match", "Close", {
          duration: 3000,
          panelClass: ["error-snackbar"],
        })
        return
      }

      this.isLoading = true

      this.authService.signup(this.signUpForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false
          console.log(res)
          if (res.id != null) {
            this.snackbar.open("Account created successfully! Please sign in.", "Close", {
              duration: 4000,
              panelClass: ["success-snackbar"],
            })
            this.router.navigate(["/login"])
          } else {
            this.snackbar.open("Signup failed. Please try again.", "Close", {
              duration: 3000,
              panelClass: ["error-snackbar"],
            })
          }
        },
        error: (error) => {
          this.isLoading = false
          console.error("Signup error:", error)
          this.snackbar.open("Signup failed. Please try again.", "Close", {
            duration: 3000,
            panelClass: ["error-snackbar"],
          })
        },
      })
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signUpForm.controls).forEach((key) => {
        this.signUpForm.get(key)?.markAsTouched()
      })
    }
  }

  // Helper methods for template
  get nameErrors() {
    const nameControl = this.signUpForm.get("name")
    if (nameControl?.errors && nameControl.touched) {
      if (nameControl.errors["required"]) return "Name is required"
      if (nameControl.errors["minlength"]) return "Name must be at least 2 characters long"
    }
    return null
  }

  get emailErrors() {
    const emailControl = this.signUpForm.get("email")
    if (emailControl?.errors && emailControl.touched) {
      if (emailControl.errors["required"]) return "Email is required"
      if (emailControl.errors["email"]) return "Please enter a valid email address"
    }
    return null
  }

  get passwordErrors() {
    const passwordControl = this.signUpForm.get("password")
    if (passwordControl?.errors && passwordControl.touched) {
      if (passwordControl.errors["required"]) return "Password is required"
      if (passwordControl.errors["minlength"]) return "Password must be at least 8 characters long"
    }
    return null
  }

  get confirmPasswordErrors() {
    const confirmPasswordControl = this.signUpForm.get("confirmPassword")
    if (confirmPasswordControl?.errors && confirmPasswordControl.touched) {
      if (confirmPasswordControl.errors["required"]) return "Please confirm your password"
    }

    // Check if passwords match
    const password = this.signUpForm.get("password")?.value
    const confirmPassword = confirmPasswordControl?.value
    if (confirmPassword && password && password !== confirmPassword && confirmPasswordControl.touched) {
      return "Passwords do not match"
    }

    return null
  }

  get passwordStrength() {
    const password = this.signUpForm.get("password")?.value
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }

    strength = Object.values(checks).filter(Boolean).length

    if (strength <= 2) return { strength, label: "Weak", color: "text-red-500" }
    if (strength <= 3) return { strength, label: "Fair", color: "text-yellow-500" }
    if (strength <= 4) return { strength, label: "Good", color: "text-blue-500" }
    return { strength, label: "Strong", color: "text-green-500" }
  }
}
