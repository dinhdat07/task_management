import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }


  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe((res: any) => {
      if (res.userId != null) {
        const user = {
          id: res.userId,
          role: res.userRole
        }
        StorageService.saveToken(res.jwt);
        StorageService.saveUser(user);
        if (StorageService.isAdminLoggedIn()) {
          this.snackbar.open('Login successful', 'Close', { duration: 2000 });
          this.router.navigate(['/admin/dashboard']);
        } else if (StorageService.isEmployeeLoggedIn()) {
          this.snackbar.open('Login successful', 'Close', { duration: 2000 });
          this.router.navigate(['/employee/dashboard']);
        }

      } else {
        this.snackbar.open('Your email or password is not correct', 'Close', {
          duration: 2000,
          panelClass: "error-snackbar"
        });
      }
    });
  }


}
