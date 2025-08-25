import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-recuperar-clave-dialog',
  templateUrl: './recuperar-clave-dialog.component.html'
})
export class RecuperarClaveDialogComponent {
  recuperarForm: FormGroup;
  cargando = false;
  errorMsg: string | null = null;
  exitoMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecuperarClaveDialogComponent>,
    private authService: AuthService,
  ) {
    this.recuperarForm = this.fb.group({
      nit: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.minLength(5),
          Validators.maxLength(12)
        ]
      ],
      numero: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  // Getters
  get nit() {
    return this.recuperarForm.get('nit')!;
  }
  get numero() {
    return this.recuperarForm.get('numero')!;
  }
  get correo() {
    return this.recuperarForm.get('correo')!;
  }

  enviarCorreo() {
    if (this.recuperarForm.valid) {
      this.cargando = true;
      this.errorMsg = null;
      this.exitoMsg = null;

      const { nit, numero, correo } = this.recuperarForm.value;

      // 🔹 Ahora enviamos nit, numero y correo
      this.authService.RequestDataobject(
        { nit, numero, correo }, // 👈 Pasamos un objeto con todos los datos
        'RecuperarClave',''
      ).subscribe({
        next: () => {
          this.exitoMsg = 'Te hemos enviado las instrucciones a tu correo.';
          this.cargando = false;

          setTimeout(() => this.dialogRef.close(), 2000);
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Ocurrió un error. Inténtalo de nuevo.';
          this.cargando = false;
        }
      });
    } else {
      this.errorMsg = 'Por favor completa todos los campos correctamente.';
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}


