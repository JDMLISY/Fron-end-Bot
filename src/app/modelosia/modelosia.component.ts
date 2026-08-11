import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-modelosia',
  templateUrl: './modelosia.component.html',
  styleUrls: ['./modelosia.component.css']
})
export class ModelosiaComponent implements OnInit {

  displayedColumns = [
    'Nombre',
    'Proveedor',
    'Modelo',
    'Activo'
  ];

  dataSource = new MatTableDataSource<any>([]);

  modelo:any;

  proveedores=[
    'OpenAI',
    'Azure OpenAI',
    'Anthropic',
    'Google Gemini',
    'Ollama',
    'Personalizado'
  ];

  modelos=[
    'gpt-5.5',
    'gpt-5.5-mini',
    'gpt-4.1',
    'gpt-4o'
  ];

  constructor( private authService: AuthService,private userService: UserService, public dialogRef: MatDialogRef<ModelosiaComponent>){
    this.modelo={
      IdModelo:0,
      Nombre:'',
      Proveedor:'',
      Modelo:'',
      UrlBase:'',
      ApiKey:'',
      Organizacion:'',
      Proyecto:'',
      Temperatura:0.0,
      MaxTokens:0,
      Activo:true
  };
;}
 
  ngOnInit():void{

      this.nuevo();
      this.listar();
      //Datos de ejemplo
   

  }

  nuevo(){

      this.modelo={
          IdModelo:0,
          Nombre:'',
          Proveedor:'',
          Modelo:'',
          UrlBase:'',
          ApiKey:'',
          Organizacion:'',
          Proyecto:'',
          Temperatura:0.0,
          MaxTokens:0,
          Activo:true
      };

  }

  guardar() {

    const datos = {
  
      accion: 'guardar',
  
      IdModelo: this.modelo.IdModelo,
  
      Nombre: this.modelo.Nombre,
  
      Proveedor: this.modelo.Proveedor,
  
      Modelo: this.modelo.Modelo,
  
      UrlBase: this.modelo.UrlBase,
  
      ApiKey: this.modelo.ApiKey,
  
      Organizacion: this.modelo.Organizacion,
  
      Proyecto: this.modelo.Proyecto,
  
      Temperatura: this.modelo.Temperatura,
  
      MaxTokens: this.modelo.MaxTokens,
  
      Activo: this.modelo.Activo
  
    };
  
    this.authService.RequestDataobject(
      datos,
      'ManteModelosIA',
      ''
    ).subscribe({
  
      next: (resp: any) => {
  
        this.userService.showSuccess(
          resp.message,
          'Modelos IA',
          'success'
        );
  
        this.nuevo();
  
        this.listar();
  
      },
  
      error: (err) => {
  
        this.userService.showSuccess(
          'Error guardando el modelo.',
          'Modelos IA',
          'error'
        );
  
      }
  
    });
  
  }
  eliminar() {

    if (this.modelo.IdModelo == 0) {
  
      this.userService.showSuccess(
        'Seleccione un modelo.',
        'Modelos IA',
        'warning'
      );
  
      return;
  
    }
  
    this.authService.RequestDataobject(
  
      {
  
        accion: 'eliminar',
  
        IdModelo: this.modelo.IdModelo
  
      },
  
      'ManteModelosIA',
  
      ''
  
    ).subscribe({
  
      next: (resp: any) => {
  
        this.userService.showSuccess(
          resp.message,
          'Modelos IA',
          'success'
        );
  
        this.nuevo();
  
        this.listar();
  
      },
  
      error: () => {
  
        this.userService.showSuccess(
          'Error eliminando.',
          'Modelos IA',
          'error'
        );
  
      }
  
    });
  
  }
  listar() {

    this.authService.RequestDataobject(
  
      {
  
        accion: 'listar'
  
      },
  
      'ManteModelosIA',
  
      ''
  
    ).subscribe({
  
      next: (resp: any) => {
  
        this.dataSource.data = resp;
  
      },
  
      error: () => {
  
        this.userService.showSuccess(
          'Error consultando los modelos.',
          'Modelos IA',
          'error'
        );
  
      }
  
    });
  
  }
  probarConexion() {

    if (!this.modelo.Proveedor) {
      return this.userService.showSuccess(
        "Seleccione un proveedor.",
        "Modelos IA",
        "warning"
      );
    }
  
    if (!this.modelo.Modelo) {
      return this.userService.showSuccess(
        "Seleccione un modelo.",
        "Modelos IA",
        "warning"
      );
    }
  
    if (!this.modelo.ApiKey || this.modelo.ApiKey.trim() === "") {
      return this.userService.showSuccess(
        "Debe ingresar la API Key.",
        "Modelos IA",
        "warning"
      );
    }
  
    // Si es OpenAI normalmente basta con dejar el valor por defecto,
    // pero si quieres obligar a escribirla:
    // if (!this.modelo.UrlBase || this.modelo.UrlBase.trim() === "") {
    //   return this.userService.showSuccess(
    //     "Debe ingresar la URL Base.",
    //     "Modelos IA",
    //     "warning"
    //   );
    // }
  
    this.authService.RequestDataobject(
      {
        accion: "probar",
        Proveedor: this.modelo.Proveedor,
        Modelo: this.modelo.Modelo,
        UrlBase: this.modelo.UrlBase,
        ApiKey: this.modelo.ApiKey,
        Organizacion: this.modelo.Organizacion,
        Proyecto: this.modelo.Proyecto,
        Temperatura: this.modelo.Temperatura,
        MaxTokens: this.modelo.MaxTokens
      },
      "ManteModelosIA",
      ""
    ).subscribe({
  
      next: (resp: any) => {
  
        if (resp.success) {
  
          this.userService.showSuccess(
  `✅ Conexión exitosa
  
  Proveedor: ${resp.proveedor}
  Modelo: ${resp.modelo}
  Tiempo: ${resp.tiempo} ms
  Tokens: ${resp.totalTokens}
  
  Respuesta:
  ${resp.respuesta}`,
            "Modelos IA",
            "success"
          );
  
        } else {
  
          this.userService.showSuccess(
            resp.message,
            "Modelos IA",
            "error"
          );
  
        }
  
      },
  
      error: () => {
  
        this.userService.showSuccess(
          "Error de comunicación con el servidor.",
          "Modelos IA",
          "error"
        );
  
      }
  
    });
  
  }
  seleccionar(row:any){

      this.modelo={...row};

  }

}