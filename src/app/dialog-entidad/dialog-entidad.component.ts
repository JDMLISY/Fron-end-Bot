import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-dialog-entidad',
  templateUrl: './dialog-entidad.component.html',
  styleUrls: ['./dialog-entidad.component.css'] // asegúrate de tenerlo
})
export class DialogEntidadComponent implements OnInit {
  form: FormGroup;
  matcher = new MyErrorStateMatcher();

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<DialogEntidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    // Inicialización de valores previos si hay edición
    this.form = this.fb.group({      
      Nitentidades: new FormControl(data?.Nitentidades || '', [Validators.required]),
      NombreEntidad: new FormControl(data?.NombreEntidad || '', [Validators.required]),
      FechaMatricula: new FormControl(data?.FechaMatricula || '', [Validators.required]),
      nombrebd: new FormControl(data?.nombrebd || '', [Validators.required]),
      Origendatos: new FormControl(data?.Origendatos || '', [Validators.required]),      
      LogoEntidad: new FormControl(data?.LogoEntidad || '')



    });
  }

  ngOnInit(): void {}
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.get('LogoEntidad')?.setValue(reader.result); // guarda en base64
      };
      reader.readAsDataURL(file);
    }
  }
  

  onSubmit(): void {
    this.authService.RequestData(this.form.value, 'entidades', '').subscribe({
      next: data => {
        this.userService.showSuccess(data.message, 'Datos Ingresados', 'success');
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        setTimeout(() => this.Limpiar(), 1000);
        setTimeout(() => this.onNoClick(), 1000);
      },
      error: err => {
        this.errorMessage = err.message;
        this.isSignUpFailed = true;
        this.userService.showSuccess(
          'Error al consultar los datos, comuníquese con el administrador...',
          'Error de comunicación',
          'error'
        );
      }
    });
  }

  Limpiar(): void {
    this.form.reset({
      idRegistro: 0
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
    window.location.reload(); // opcional, puedes quitarlo si no deseas recargar
  }
}
