import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { ReactiveFormsModule } from "@angular/forms"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { of } from "rxjs"
import { AuthService } from "../../services/auth/auth.service"

import { SignupComponent } from "./signup.component"

describe("SignupComponent", () => {
  let component: SignupComponent
  let fixture: ComponentFixture<SignupComponent>
  let mockAuthService: jasmine.SpyObj<AuthService>
  let mockRouter: jasmine.SpyObj<Router>

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj("AuthService", ["signup"])
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"])

    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [ReactiveFormsModule, MatSnackBarModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SignupComponent)
    component = fixture.componentInstance
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>

    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should initialize form with empty values", () => {
    expect(component.signUpForm.get("name")?.value).toBeNull()
    expect(component.signUpForm.get("email")?.value).toBeNull()
    expect(component.signUpForm.get("password")?.value).toBeNull()
    expect(component.signUpForm.get("confirmPassword")?.value).toBeNull()
  })

  it("should validate name field", () => {
    const nameControl = component.signUpForm.get("name")

    nameControl?.setValue("")
    nameControl?.markAsTouched()
    expect(component.nameErrors).toBe("Name is required")

    nameControl?.setValue("A")
    expect(component.nameErrors).toBe("Name must be at least 2 characters long")

    nameControl?.setValue("John Doe")
    expect(component.nameErrors).toBeNull()
  })

  it("should validate email field", () => {
    const emailControl = component.signUpForm.get("email")

    emailControl?.setValue("")
    emailControl?.markAsTouched()
    expect(component.emailErrors).toBe("Email is required")

    emailControl?.setValue("invalid-email")
    expect(component.emailErrors).toBe("Please enter a valid email address")

    emailControl?.setValue("test@example.com")
    expect(component.emailErrors).toBeNull()
  })

  it("should validate password field", () => {
    const passwordControl = component.signUpForm.get("password")

    passwordControl?.setValue("")
    passwordControl?.markAsTouched()
    expect(component.passwordErrors).toBe("Password is required")

    passwordControl?.setValue("123")
    expect(component.passwordErrors).toBe("Password must be at least 8 characters long")

    passwordControl?.setValue("password123")
    expect(component.passwordErrors).toBeNull()
  })

  it("should check password strength", () => {
    component.signUpForm.get("password")?.setValue("weak")
    expect(component.passwordStrength.label).toBe("Weak")

    component.signUpForm.get("password")?.setValue("StrongPass123!")
    expect(component.passwordStrength.label).toBe("Strong")
  })

  it("should validate password confirmation", () => {
    component.signUpForm.patchValue({
      password: "password123",
      confirmPassword: "different",
    })
    component.signUpForm.get("confirmPassword")?.markAsTouched()
    expect(component.confirmPasswordErrors).toBe("Passwords do not match")

    component.signUpForm.patchValue({
      confirmPassword: "password123",
    })
    expect(component.confirmPasswordErrors).toBeNull()
  })

  it("should toggle password visibility", () => {
    expect(component.showPassword).toBeFalse()
    component.togglePasswordVisibility()
    expect(component.showPassword).toBeTrue()
  })

  it("should handle successful signup", () => {
    const mockResponse = { id: "123" }
    mockAuthService.signup.and.returnValue(of(mockResponse))

    component.signUpForm.patchValue({
      name: "John Doe",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    })

    component.onSubmit()

    expect(mockAuthService.signup).toHaveBeenCalled()
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"])
  })
})
