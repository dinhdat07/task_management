import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signUpForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router) {
    
    this.signUpForm = this.fb.group({
      name:[null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    console.log(this.signUpForm.value);
    const password = this.signUpForm.get('password')?.value;
    const confirmPassword = this.signUpForm.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      this.snackbar.open('Passwords do not match', 'Close', {
        duration: 2000,
        panelClass: "error-snackbar"
      });
      return;
    }
    
    this.authService.signup(this.signUpForm.value).subscribe((res: any) => {
      console.log(res);
      if (res.id != null) {
        this.snackbar.open('Signup successful', 'Close', { duration: 2000 });
        this.router.navigate(['/login']);
      } else {
        this.snackbar.open('Signup failed', 'Close', {
          duration: 2000,
          panelClass: "error-snackbar"
        });
      }
    });

  }




}
