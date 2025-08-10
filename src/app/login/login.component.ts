import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core/testing';
import { UserService } from '../_services/user.service';
import { NgForm } from '@angular/forms';
import { ChatService } from '../web-socket.service';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  token: string|undefined;


  form: any = {
    username: null,
    password: null,
    Nit: null,    
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  name: string[] = [];
  captchaResolved = false
  hidePassword: boolean = true;

  constructor(private userService: UserService,private chatService: ChatService,  private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router ) {
    this.token = undefined;
    

   }
   resolved(captchaResponse: string) {

    this.captchaResolved = (captchaResponse && captchaResponse.length > 0) ? true : false


  }
  
   public send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }

    console.debug(`Token [${this.token}] generated`);
  }
  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.name = this.tokenStorage.getUser().name;
    }
    // this.chatService.getNewMessage().subscribe((message: any) => {
     
    // });
   
  }
  encryptData(data: any, secretKey: string): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  }
  onSubmit(): void {
    if (!this.captchaResolved) {
      this.userService.showSuccess("por favor validar si no es robot", "Validación de captcha", "Error");
      return;
    }
  
    const payload = {
      username: this.form.username,
      password: this.form.password,
      Nit: this.form.Nit
    };
  
    const encryptedData = this.encryptData(payload, environment.SecretKey);
  
    this.authService.login(encryptedData).subscribe({
      next: data => {
        if (data.message == "Autenticación Fallida")
                  {
          
                    this.userService.showSuccess(data.message,"Error Usuario o Password Incorrecto","Error")
                    // this.errorMessage = data.message;
                    this.isLoginFailed = true;
                    
                  }else 
                  {
                  
                 this.userService.showSuccess(data.message,"Ingreso Correcto","info")
                 
                 
                 this.tokenStorage.saveToken(data.accessToken);
                  this.tokenStorage.saveUser(data);
          
                  this.isLoginFailed = false;
                  this.isLoggedIn = true;
                 
                  this.roles = this.tokenStorage.getUser().roles;
                  this.name = this.tokenStorage.getUser().name;
          
               // this.router.navigate(["/listAso"])
               setTimeout(() => this.reloadPage(), 20);
                 // this.reloadPage().timeout();
                  }
                },
                error: err => {
                  this.errorMessage = err.error.message;
                  this.isLoginFailed = true;
                }      
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}