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
  hovered: boolean = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  mostrarNombreBD: boolean = false;
  bdentidades: { NombreCatalogo: string }[] = [];


  constructor(
    public dialogRef: MatDialogRef<DialogEntidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {

    
    // Inicialización de valores previos si hay edición
    this.form = this.fb.group({      
      idEntidad: new FormControl(data.Codigo?.idEntidad),
      Nitentidades: new FormControl(data.Codigo?.Nitentidades || '', [Validators.required]),
      NombreEntidad: new FormControl(data.Codigo?.NombreEntidad || '', [Validators.required]),
      AliasBD: new FormControl(data.Codigo?.AliasBD || '', [Validators.required]),
      FechaMatricula: new FormControl(data.Codigo?.FechaMatricula || '', [Validators.required]),
      nombrebd: new FormControl(data.Codigo?.nombrebd || '', [Validators.required]),
      Origendatos: new FormControl(data.Codigo?.Origendatos || '', [Validators.required]),      
      LogoEntidad: new FormControl(data.Codigo?.LogoEntidad || '')



    });

    
    this.form.get('Origendatos')?.valueChanges.subscribe((valor) => {
      if (valor == "Soari")
        {
          this.mostrarNombreBD = true

          this.authService.RequestData('', 'bdentidades', '').subscribe({
            next: (data: any[]) => {
              console.log('✅ Nits recibidos:', data);
              this.bdentidades = data[0];
            },
            error: err => {
              console.error('❌ Error cargando NITs:', err);
              this.bdentidades = [];
            }
          });

        }else 
        {this.mostrarNombreBD = false}


    });
    
    
  }
 
  
  ngOnInit(): void {}
  // onFileSelected(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.form.get('LogoEntidad')?.setValue(reader.result); // guarda en base64
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.form.get('LogoEntidad')?.setValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
  
  onSubmit(): void {
    const body = {
      accion: this.data.accion, // Aquí defines la acción que quieras (crear, editar, eliminar, listar)
      newData: this.form.value
    };
  
    this.authService.RequestDataobject(body, 'entidades', '').subscribe({
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
