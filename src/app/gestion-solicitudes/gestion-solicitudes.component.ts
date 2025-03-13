import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserService } from '../_services/user.service';

import { AuthService } from '../_services/auth.service';
import {FormControl,FormControlDirective,FormGroupDirective,NgForm, FormsModule, ReactiveFormsModule,FormGroup,Validator,FormBuilder, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { dribbbleBoxIcon } from '@progress/kendo-svg-icons';

export class MyErrorStateMatcher implements ErrorStateMatcher  {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-gestion-solicitudes',
  templateUrl: './gestion-solicitudes.component.html',
  styleUrls: ['./gestion-solicitudes.component.css'],
  
})

export class GestionSolicitudesComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  form: any = {
Descripcion: ""
      };

      numero = ""
  // dataSource : string[] 
  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];


  dataDescripciones1 = [
    { Radicado: "", Tipo_atencion: ""},
 
    //etc
  ];
  



  constructor( private userService: UserService, public dialog: MatDialog, private authService: AuthService,public fb: FormBuilder, matFormFieldModule: MatFormFieldModule, matSelectModule: MatSelectModule, formsModule:FormsModule, reactiveFormsModule:ReactiveFormsModule, public dialogRef: MatDialogRef<GestionSolicitudesComponent>,
    @Inject(MAT_DIALOG_DATA) public  data: any,) {
      form: FormGroup;
      this.dataDescripciones1 = data.data
      this.numero =   data.data[0].Numero_asociado
     }

  ngOnInit(): void {
       
  //   this.form = this.formBuilder.group({
      
  //     Usuario : new FormControl( this.form.Usuario, [Validators.required,Validators.maxLength(3)]),
  //     Nombre : new FormControl(this.form.Nombre, [Validators.required,Validators.maxLength(50)]),
  //     Password : new FormControl(this.form.Password, [Validators.required,Validators.pattern(StrongPasswordRegx)]),
  //     Email : new FormControl(this.form.email, [Validators.required,Validators.email]),
  //     Celular: new FormControl(this.form.celular, [Validators.required]),
  //     Perfil: new FormControl(this.form.Perfil, [Validators.required]),
  //     Estado : new FormControl(this.form.estado, [Validators.required]),
  //     Tipo_atencion : new FormControl(this.form.tipo_atencion, [Validators.required]),
  //     idRegistro : new FormControl(this.form.idRegistro,[])

  // });
    this.form = this.fb.group({   
      Descripcion : new FormControl( this.form.Descripcion, [Validators.required]),
      Lista : new FormControl(this.form.Lista, [Validators.required])})
    // 1. Crear un nuevo control por cada registro de la tabla y asignarle un correlativo



  }

  onCtrlValidate(name: any, error: any): FormControlDirective {
    return <FormControlDirective>this.form.controls[name].errors?.[error]
  }
  
  onNoClick(): void {
    this.dialogRef.close(false);
   
  }

  onSubmit(): void {
     
    var data = this.form.value
    
    this.authService.RequestData(this.form.value,'GuardarGestion',this.numero).subscribe({
      next: data => {
     
        this.userService.showSuccess(data.message,"Datos Ingresados",'success')
        // this.isSuccessful = true;
        // this.isSignUpFailed = false;
        // setTimeout(() => this.Limpiar(), 1000);
         setTimeout(() => this.onNoClick(), 1000);
      

      },
      error: err => {
        // this.errorMessage = err.message;
        // this.isSignUpFailed = true;
        this.userService.showSuccess("Error al Guardar los datos, Comuniquese con el Administrador del sistema...","Error de comunicaciòn",'Error')  
      }
    });
  }
  // ngAfterViewInit() {
    
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

 
}
