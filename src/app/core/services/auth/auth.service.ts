import { Injectable,signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = signal<boolean>(false);

  constructor(private router: Router) {
    const saved = localStorage.getItem('isLoggedIn');
    this._isLoggedIn.set(saved === 'true');
  }

  login(email: string, password: string) {
    if (!email || !password) return;

    this._isLoggedIn.set(true);
    localStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/orders']);
  }

  logout() {
    this._isLoggedIn.set(false);
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this._isLoggedIn();
  }
}
