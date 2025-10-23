import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-modal-actualizar-asociado',
  templateUrl: './modal-actualizar-asociado.component.html',
  styleUrls: ['./modal-actualizar-asociado.component.css']
})
export class ModalActualizarAsociadoComponent implements OnInit {
  
  form!: FormGroup;
  asociado: any; // ✅ propiedad para recibir los datos del asociado

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ModalActualizarAsociadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.asociado = data; // ✅ recibimos el asociado desde el componente padre
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      Celular: [this.asociado?.Celular || '', [Validators.required]],
      Correo: [this.asociado?.Correo || '', [Validators.required, Validators.email]],
      Estado: [this.asociado?.Estado || 'Activo', Validators.required]
    });
  }

  guardarCambios(): void {
    if (this.form.invalid) return;

    const newData = {
      Cedula: this.asociado.Cedula,
      Celular: this.form.value.Celular,
      Correo: this.form.value.Correo,
      Estado: this.form.value.Estado
    };

    this.authService.RequestDataobject(newData, 'actualizarasociado', '').subscribe({
      next: (resp) => {
        console.log('✅ Respuesta del backend:', resp);
        this.dialogRef.close(true); // cerramos el modal y devolvemos true
      },
      error: (err) => {
        console.error('❌ Error al actualizar asociado:', err);
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}
