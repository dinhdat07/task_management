import { Injectable } from '@angular/core';

const TOKEN = 'token';
const USER = 'user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  static saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  static saveUser(user: any): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  static getToken(): string {
    return localStorage.getItem(TOKEN) || '';
  }

  static getUser(): any {
    const user = localStorage.getItem(USER);
    return user ? JSON.parse(user) : null;
  }

  static getUserRole(): string {
    const user = localStorage.getItem(USER);
    return user ? JSON.parse(user).role : '';
  }

  static isAdminLoggedIn(): boolean {  
    if (this.getToken() === null) return false;
    const role: string = this.getUserRole();
    return role === 'ADMIN';
  }

  static isEmployeeLoggedIn(): boolean {
    if (this.getToken() === null) return false;
    const role: string = this.getUserRole();
    return role === 'EMPLOYEE';
  }

  static getUserId(): string {
    const user = localStorage.getItem(USER);
    if (user) {
      return JSON.parse(user).id;
    }
    return '';
  }

  static logout(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }


}
