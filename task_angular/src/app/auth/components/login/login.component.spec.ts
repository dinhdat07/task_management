import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { ReactiveFormsModule } from "@angular/forms"
import { MatSnackBarModule } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { of } from "rxjs"
import { AuthService } from "../../services/auth/auth.service" // Declare the AuthService import

import { LoginComponent } from "./login.component"
import type { AuthService as AuthServiceType } from "../../services/auth/auth.service" // Declare the AuthService type

describe("LoginComponent", () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>
  let mockAuthService: jasmine.SpyObj<AuthServiceType>
  let mockRouter: jasmine.SpyObj<Router>

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj("AuthService", ["login"])
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"])

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, MatSnackBarModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthServiceType>
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>

    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should initialize form with empty values", () => {
    expect(component.loginForm.get("email")?.value).toBeNull()
    expect(component.loginForm.get("password")?.value).toBeNull()
  })

  it("should toggle password visibility", () => {
    expect(component.showPassword).toBeFalse()
    component.togglePasswordVisibility()
    expect(component.showPassword).toBeTrue()
  })

  it("should handle form submission", () => {
    const mockResponse = { userId: "123", userRole: "ADMIN", jwt: "token" }
    mockAuthService.login.and.returnValue(of(mockResponse))

    component.loginForm.patchValue({
      email: "test@example.com",
      password: "password123",
    })

    component.onSubmit()
    expect(mockAuthService.login).toHaveBeenCalled()
  })
})
