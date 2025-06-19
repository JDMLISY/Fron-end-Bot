import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';
import {FormControl, FormGroupDirective, NgForm, Validators,FormGroup,FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';

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
  selector: 'app-dialogoarticulo',
  templateUrl: './dialogoarticulo.component.html',
  styleUrls: ['./dialogoarticulo.component.css']
})
export class DialogoarticuloComponent implements OnInit  {


  matcher = new MyErrorStateMatcher();

  form: any = {
    idRegistro: 0
      };

      isSuccessful = false;
      isSignUpFailed = false;
      errorMessage = '';

      
      
  constructor( private userService: UserService, public dialog: MatDialog,private tokenStorage: TokenStorageService, private authService: AuthService,private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogoarticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string[],
  ) {
    form: FormGroup;
    form: {
      idRegistro: 0
        };
    this.form = data;
  
  	//this.form.get('Usuario').setValue(data)
    this.form = this.formBuilder.group({
      
      Usuario : new FormControl( this.form.Usuario, [Validators.required,Validators.maxLength(3)]),
      Nombre : new FormControl(this.form.Nombre, [Validators.required,Validators.maxLength(50)]),
      Password : new FormControl(this.form.Password, [Validators.required,Validators.pattern(StrongPasswordRegx)]),
      Email : new FormControl(this.form.email, [Validators.required,Validators.email]),
      Celular: new FormControl(this.form.celular, [Validators.required]),
      Perfil: new FormControl(this.form.Perfil, [Validators.required]),
      Estado : new FormControl(this.form.estado, [Validators.required]),
      Tipo_atencion: new FormControl(
        Array.isArray(this.form.tipo_atencion)
          ? this.form.tipo_atencion
          : [this.form.tipo_atencion] // 👈 convierte 'T' en ['T']
      ),
      //Tipo_atencion : new FormControl(this.form.tipo_atencion, [Validators.required]),
      idRegistro : new FormControl(this.form.idRegistro,[])

  });


  }
  compareObjects(o1: any, o2: any): boolean {
    return o1 === o2;
  }
  ngOnInit(): void {

    var variables = this.form
  }
  onSubmit(): void {
    
        this.authService.RequestData(this.form.value,'Registarse',"").subscribe({
          next: data => {
           
            this.userService.showSuccess(data.message,"Datos Ingresados",'success')
            this.isSuccessful = true;
            this.isSignUpFailed = false;
            this.tokenStorage.saveUser(data);
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
