import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';
import {FormControl, FormGroupDirective, NgForm, Validators,FormGroup,FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { UserService } from '../_services/user.service';

export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

export class MyErrorStateMatcher implements ErrorStateMatcher  {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
export interface DialogData {
  Usuario: string;
  Nombre: string;
  Celular: string;
}


@Component({
  selector: 'app-dialogo-activarmodulo',
  templateUrl: './dialogo-activarmodulo.component.html',
  styleUrls: ['./dialogo-activarmodulo.component.css']
})
export class DialogoActivarmoduloComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  form: any = {
    idRegistro: 0
      };

      isSuccessful = false;
      isSignUpFailed = false;
      errorMessage = '';
      titulo= "";
      icono = "";

      
      
  constructor( private userService: UserService, public dialog: MatDialog, private authService: AuthService,private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogoActivarmoduloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[],
  ) {
    form: FormGroup;
    form: {
      idRegistro: 0
        };
    this.form = data;
  
if (this.form.idRegistro == 1)
  {

    this.titulo= "Actualizar";
    this.icono = "update";

  }else {

    this.titulo= "Activar";
    this.icono = "airplanemode_active";
  }



  	//this.form.get('Usuario').setValue(data)
    this.form = this.formBuilder.group({
      
      Entidad : new FormControl( this.form.Entidad, [Validators.required]),
      Estado : new FormControl(this.form.Estado, [Validators.required]),
      Modulo : new FormControl(this.form.Modulo, [Validators.required]),
      idRegistro : new FormControl(this.form.idRegistro,[])

  });


  }

  ngOnInit(): void {

    var variables = this.form
  }
  onSubmit(): void {
    
        this.authService.RequestData(this.form.value,'ActivarModulo',"").subscribe({
          next: data => {
       
            this.userService.showSuccess(data.message,"Datos Ingresados",'success')
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            setTimeout(() => this.Limpiar(), 1000);
            setTimeout(() => this.onNoClick(), 1000);
          

          },
          error: err => {
            this.errorMessage = err.message;
            this.isSignUpFailed = true;
            this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...","Error de comunicaciòn",'Error')  
          }
        });
      }

Limpiar(){
  this.form.reset()
  

  this.form.value = {
    idRegistro: 0
      };

}

  onNoClick(): void {
    this.dialogRef.close();
    window.location.reload();
  }

}
