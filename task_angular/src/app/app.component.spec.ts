import { TestBed } from "@angular/core/testing"
import { Router } from "@angular/router"
import { of } from "rxjs"
import { AppComponent } from "./app.component"
import { StorageService } from "./auth/services/storage/storage.service"

describe("AppComponent", () => {
  let mockRouter: jasmine.SpyObj<Router>

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl"], {
      events: of({}),
    })

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents()

    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>
  })

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it("should initialize login states", () => {
    spyOn(StorageService, "isEmployeeLoggedIn").and.returnValue(false)
    spyOn(StorageService, "isAdminLoggedIn").and.returnValue(false)

    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance

    expect(app.isEmployeeLoggedIn).toBeFalse()
    expect(app.isAdminLoggedIn).toBeFalse()
  })

  it("should toggle mobile menu", () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance

    expect(app.isMobileMenuOpen).toBeFalse()
    app.toggleMobileMenu()
    expect(app.isMobileMenuOpen).toBeTrue()
    app.toggleMobileMenu()
    expect(app.isMobileMenuOpen).toBeFalse()
  })

  it("should close mobile menu", () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance

    app.isMobileMenuOpen = true
    app.closeMobileMenu()
    expect(app.isMobileMenuOpen).toBeFalse()
  })

  it("should logout and navigate to login", () => {
    spyOn(StorageService, "logout")
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance

    app.logout()

    expect(StorageService.logout).toHaveBeenCalled()
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith("/login")
  })

  it("should return correct user role", () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance

    app.isAdminLoggedIn = true
    app.isEmployeeLoggedIn = false
    expect(app.currentUserRole).toBe("Admin")

    app.isAdminLoggedIn = false
    app.isEmployeeLoggedIn = true
    expect(app.currentUserRole).toBe("Employee")

    app.isAdminLoggedIn = false
    app.isEmployeeLoggedIn = false
    expect(app.currentUserRole).toBe("")
  })

  it("should return correct login status", () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance

    app.isAdminLoggedIn = true
    app.isEmployeeLoggedIn = false
    expect(app.isLoggedIn).toBeTrue()

    app.isAdminLoggedIn = false
    app.isEmployeeLoggedIn = true
    expect(app.isLoggedIn).toBeTrue()

    app.isAdminLoggedIn = false
    app.isEmployeeLoggedIn = false
    expect(app.isLoggedIn).toBeFalse()
  })
})
