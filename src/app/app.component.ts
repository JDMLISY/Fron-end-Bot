import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';

import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showSuperAdminBoard = false;
  showModeratorBoard = false;
  modulo = false
  username?: string;

  constructor(private tokenStorageService: TokenStorageService,public services :AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showSuperAdminBoard = this.roles.includes('S');
      this.showAdminBoard = this.roles.includes('A');
      this.showModeratorBoard = this.roles.includes('U');

      this.username = user.name;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
    
  }

  // ValidarModulo(): void {
    

  //   this.router.navigate(["/listAso"]);
  // }
 
}