import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../_services/auth.service';

const AUTH_API = environment.AUTH_API;
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  nit: string = '';
  form: FormGroup;
  mensaje: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private AuthServiceS: AuthService
  ) {
    this.form = this.fb.group({
      nuevaClave: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.nit = this.route.snapshot.queryParamMap.get('nit') || '';

  }

  resetPassword() {
    
    if (this.form.invalid) return;
  
    const newData = {
      nuevaClave: this.form.value.nuevaClave,
      token: this.token,
      Nit:this.nit
    };
  
    // Llamamos al servicio genérico
    this.AuthServiceS.RequestDataobject(newData, 'reset-password', '').subscribe({
      next: (res: any) => {
        this.mensaje = 'Contraseña actualizada correctamente.';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.mensaje = 'Token inválido o expirado.';
      }
    });
  }
  
}

