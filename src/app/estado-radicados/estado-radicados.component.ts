import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserService } from '../_services/user.service';

import { AuthService } from '../_services/auth.service';
import {FormControl,FormControlDirective,FormGroupDirective,NgForm, FormsModule, ReactiveFormsModule,FormGroup,Validator,FormBuilder, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { dribbbleBoxIcon } from '@progress/kendo-svg-icons';
import { TokenStorageService } from '../_services/token-storage.service';
import { MatTableDataSource } from '@angular/material/table';

export class MyErrorStateMatcher implements ErrorStateMatcher  {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-estado-radicados',
  templateUrl: './estado-radicados.component.html',
  styleUrls: ['./estado-radicados.component.css'],
  
})

export class estadoradicadosComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['seleccion', 'idRegistro', 'Tipo_atencion', 'Numero_asociado', 'contacto', 'Radicado', 'fecha_solicitud'];
  selection: any[] = [];
  form!: FormGroup;
  matcher = new MyErrorStateMatcher();


      numero = ""
  // dataSource : string[] 
  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];


  dataDescripciones1 = [
    { Nombre: ""},
 
    //etc
  ];
  submitted = false; // Para controlar cuándo mostrar el error



  constructor( private userService: UserService, public dialog: MatDialog, private authService: AuthService,public fb: FormBuilder, matFormFieldModule: MatFormFieldModule, matSelectModule: MatSelectModule, formsModule:FormsModule, reactiveFormsModule:ReactiveFormsModule,private tokenStorage: TokenStorageService, public dialogRef: MatDialogRef<estadoradicadosComponent>,
    ) {
      
      

      // this.dataDescripciones1 = data.data
      // this.numero =   data.data[0].Numero_asociado
     }

//   ngOnInit(): void {
       
//   //   this.form = this.formBuilder.group({
      
//   //     Usuario : new FormControl( this.form.Usuario, [Validators.required,Validators.maxLength(3)]),
//   //     Nombre : new FormControl(this.form.Nombre, [Validators.required,Validators.maxLength(50)]),
//   //     Password : new FormControl(this.form.Password, [Validators.required,Validators.pattern(StrongPasswordRegx)]),
//   //     Email : new FormControl(this.form.email, [Validators.required,Validators.email]),
//   //     Celular: new FormControl(this.form.celular, [Validators.required]),
//   //     Perfil: new FormControl(this.form.Perfil, [Validators.required]),
//   //     Estado : new FormControl(this.form.estado, [Validators.required]),
//   //     Tipo_atencion : new FormControl(this.form.tipo_atencion, [Validators.required]),
//   //     idRegistro : new FormControl(this.form.idRegistro,[])

//   // });
//     this.form = this.fb.group({   
//       Lista : new FormControl(this.form.Lista, [Validators.required])})
//     // 1. Crear un nuevo control por cada registro de la tabla y asignarle un correlativo

// this.consultarusers()

//   }
  ngOnInit(): void {
    this.form = this.fb.group({
      Lista: [null, Validators.required]
    });
    this.consultarusers()
}
  onCtrlValidate(name: any, error: any): FormControlDirective {
    return <FormControlDirective>this.form.controls[name].errors?.[error]
  }
  
  onNoClick(): void {
    this.dialogRef.close(false);
   
  }

  // onSubmit(): void {
     
  //   var data = this.form.value
    
  //   this.authService.RequestData(this.form.value,'GuardarGestion',this.numero).subscribe({
  //     next: data => {
     
  //       this.userService.showSuccess(data.message,"Datos Ingresados",'success')
  //       // this.isSuccessful = true;
  //       // this.isSignUpFailed = false;
  //       // setTimeout(() => this.Limpiar(), 1000);
  //        setTimeout(() => this.onNoClick(), 1000);
      

  //     },
  //     error: err => {
  //       // this.errorMessage = err.message;
  //       // this.isSignUpFailed = true;
  //       this.userService.showSuccess("Error al Guardar los datos, Comuniquese con el Administrador del sistema...","Error de comunicaciòn",'Error')  
  //     }
  //   });
  // }


consultarusers(){
  this.authService.ConsultarUsers().subscribe({
    next: data => {
      
      if (data.length > 0)
      {
        this.dataDescripciones1 = data
        return
        
      }else 
      {
        if (data.Codigo== "401")
        {
          
          this.userService.showSuccess(data.Mensaje,"Error de comunicaciòn",'Error')
          setTimeout(() => this.tokenStorage.signOut(), 20);
             return    
        }

        this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...","Error de comunicaciòn",'Error')  
        //this.errorMessage = data.message;
      }
    },
    error: err => {
      this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...","Error de comunicaciòn",'Error')  
     // this.errorMessage = err.error.message;
      
    }
  })

}


gestionarestadosolicitudes(valor:string):void{

  this.userService.Solicitudes("Solicitudes", this.tokenStorage.getUser(),"users",valor,"","").subscribe({
    next: data => {
      if (data.length > 0) {
        this.dataSource = new MatTableDataSource(data);
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
                
        return
      } else {


        if (data.Codigo == "401") {
          this.userService.showSuccess(data.Mensaje, "Error de comunicaciòn", 'Error')
          setTimeout(() => this.tokenStorage.signOut(), 20);
          return
        } else 
        {
          this.dataSource.data = [];
          
          if (data.message != undefined) {
            this.userService.showSuccess(data.message, "Consulta Solicitudes", 'Warning')            
            return
          }

        }

      }
    },
    error: err => {
      this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
    }
  })

}


onSubmit() {
  this.submitted = true;

  if (this.selection.length === 0) {
    return; // Validación: al menos un checkbox debe estar seleccionado
  }

  if (this.form.valid) {
    
    var data = this.selection
    
      this.authService.RequestDataobject(this.selection,'ActualizarGestion',this.numero).subscribe({
        next: data => {
       
          this.userService.showSuccess(data[0].message,"Datos Ingresados",'success')
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
}

toggleRow(row: any) {
  const index = this.selection.indexOf(row);
  if (index === -1) {
    this.selection.push(row);
  } else {
    this.selection.splice(index, 1);
  }
}

toggleAllRows(event: any) {
  if (event.checked) {
    this.selection = [...this.dataSource.data]; // Selecciona todos
  } else {
    this.selection = []; // Deselecciona todos
  }
}

isAllSelected(): boolean {
  return this.selection.length === this.dataSource.data.length;
}

isSomeSelected(): boolean {
  return this.selection.length > 0 && !this.isAllSelected();
}

 
}
