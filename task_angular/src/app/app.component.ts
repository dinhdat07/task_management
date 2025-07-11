import { Component, type OnInit } from "@angular/core"
import { Router, NavigationEnd } from "@angular/router"
import { StorageService } from "./auth/services/storage/storage.service"
import { filter } from "rxjs/operators"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  isEmployeeLoggedIn: boolean = StorageService.isEmployeeLoggedIn()
  isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn()
  isMobileMenuOpen = false

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen only to NavigationEnd events to avoid unnecessary updates
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isEmployeeLoggedIn = StorageService.isEmployeeLoggedIn()
      this.isAdminLoggedIn = StorageService.isAdminLoggedIn()
    })
  }

  logout() {
    StorageService.logout()
    this.router.navigateByUrl("/login")
    this.isMobileMenuOpen = false
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false
  }

  get currentUserRole(): string {
    if (this.isAdminLoggedIn) return "Admin"
    if (this.isEmployeeLoggedIn) return "Employee"
    return ""
  }

  get isLoggedIn(): boolean {
    return this.isAdminLoggedIn || this.isEmployeeLoggedIn
  }
}
