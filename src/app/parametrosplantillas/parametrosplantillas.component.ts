import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';



@Component({
  selector: 'app-parametrosplantillas',
  templateUrl: './parametrosplantillas.component.html',
  styleUrls: ['./parametrosplantillas.component.css']
})
export class ParametrosplantillasComponent implements OnInit {
  plantilla = {
    id: 0,
    tipo: '', 
    nombreMeta: '',
    activa: true
  };
  displayedColumns: string[] = [
    'Tipo',
    'NombrePlantilla',
    'Activa'
  ];
  filaSeleccionada:any=null;
  plantillas: any[] = [];

  constructor(  private authService: AuthService,private userService: UserService, public dialogRef: MatDialogRef<ParametrosplantillasComponent>) { }

  ngOnInit(): void {
    this.listar()
  }
  guardar() {

    if (!this.plantilla.tipo) {
  
      alert("Debe seleccionar el tipo de campaña.");
      return;
  
    }
  
    if (!this.plantilla.nombreMeta) {
  
      alert("Debe ingresar el nombre de la plantilla.");
      return;
  
    }
  
    const newData = {
  
      accion: "guardar",
  
      Tipo: this.plantilla.tipo,
  
      NombrePlantilla: this.plantilla.nombreMeta,
  
      Activa: this.plantilla.activa
  
    };
  
    this.authService.RequestDataobject(
        newData,
        "Manteplantillaswhatsapp",
        ""
    ).subscribe({
  
        next: (resp: any) => {
  
            alert(resp.message);
  
            //Limpiar formulario
            this.limpiar();
  
            //Recargar la tabla
            this.listar();
  
        },
  
        error: (err) => {
  
            console.error(err);
  
            alert("Ocurrió un error guardando la plantilla.");
  
        }
  
    });
  
  }
limpiar() {

  this.plantilla = {

      id: 0,
      tipo: '',
      nombreMeta: '',
      activa: false

  };

}


cancelar() {

  this.dialogRef.close();

}
listar() {

  const newData = {

    accion: "listar"

  };

  this.authService.RequestDataobject(
    newData,
    "Manteplantillaswhatsapp",
    ""
  ).subscribe({

    next: (resp: any) => {

      this.plantillas = resp;

    },

    error: (err) => {

      console.error(err);

    }

  });

}

listaruno() {

  const newData = {

      accion: "listaruno",
      Tipo: this.plantilla.tipo

  };

  this.authService.RequestDataobject(
      newData,
      "Manteplantillaswhatsapp",
      ""
  ).subscribe({

      next: (resp: any) => {

       

          if (resp && resp.length > 0) {
      
              this.plantilla = {
      
                  id: resp[0].id,
                  tipo: resp[0].Tipo,
                  nombreMeta: resp[0].NombrePlantilla,
                  activa: resp[0].Activa,
                  
      
              };
      
          }
          else {
      
              this.plantilla = {
      
                  id: 0,
                  tipo: this.plantilla.tipo, // conserva el tipo seleccionado
                  nombreMeta: "",
                  activa: true,
                  
      
              };
      
          }
      
      
      },

      error: (err) => {

          console.error(err);

      }

  });

}

seleccionarPlantilla(row: any) {

  this.filaSeleccionada = row;

  this.plantilla.id = row.id;

  this.plantilla.tipo = row.Tipo;

  this.plantilla.nombreMeta = row.NombrePlantilla;

  this.plantilla.activa = row.Activa;

}
}
