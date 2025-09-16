import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SessionOverlayService } from '../session-overlay.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {
  constructor(private sessionOverlay: SessionOverlayService,private router: Router ) { }

  // signOut(): void {
  //   window.sessionStorage.clear();
  
  //   this.router.navigate(['/login'])
  //   // window.location.reload();
  // }

  signOut(): void {
    window.sessionStorage.clear();
  
    // 🔹 Recargamos el login con un query param que avisa que se cerró la sesión
    window.location.href = '/login?session=ended';
  }
  
  
  
  
  // signOut(): void {
  //   window.sessionStorage.clear();
  //   window.location.href = '/login';
  //   //window.location.href = '/session-ended';
  // }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}