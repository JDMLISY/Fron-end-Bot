import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';

import { MatSelectionList, MatListOption } from '@angular/material/list';



interface Usuario {
  Nombre: string;
  tipo_atencion: string; // puede venir como "T", "C,E", etc.
  tipo_atencion_desc?: string;
}

@Component({
  selector: 'app-traslado-conversaciones',
  templateUrl: './traslado-conversaciones.component.html',
  styleUrls: ['./traslado-conversaciones.component.css']
})
export class TrasladoConversacionesComponent implements OnInit {
  usuariosFiltrados: Usuario[] = [];

  tipoAtencionMap: { [key: string]: string } = {
    T: 'Todos',
    A: 'Ahorro a la vista',
    C: 'Créditos',
    E: 'Estados de cuenta',
    CP: 'Cotización de pólizas',
    CE: 'Certificados',
    DN: 'Descuentos de nómina',
    EC: 'Envío de consignaciones',
    CB: 'Compra Boletería de cine',
    CA: 'Comunicarse con asesor',
  };
  observaciones: string = '';
Radicado = ""
  constructor(
    public dialogRef: MatDialogRef<TrasladoConversacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private authService: AuthService,private userService: UserService,private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.Radicado = this.data.Radicado
    this.usuariosFiltrados = this.data.usuarios.map((usuario: Usuario) => {
      const codigos = usuario.tipo_atencion?.split(',') || [];
      const descripciones = codigos.map(codigo => this.tipoAtencionMap[codigo.trim()] || '(N/A)');
      return {
        ...usuario,
        tipo_atencion_desc: descripciones.join(', ')
      };
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  usuarioSeleccionado: any;

  trasladar() {
    if (!this.usuarioSeleccionado) {
      this.userService.showSuccess("Debes seleccionar un usuario para trasladar", "Validación", "warning");
      return;
    }
  
    if (!this.usuarioSeleccionado.tipo_atencion) {
      this.userService.showSuccess("Debes seleccionar un tipo de atención para el usuario", "Validación", "warning");
      return;
    }
  
    const payload = {
      Nombre: this.usuarioSeleccionado.Nombre,
      Tipo_atencion: this.usuarioSeleccionado.tipo_atencion,
      Nit: this.data.nit ?? this.tokenStorage.getUser()?.Nit,
      contacto: this.data.contacto,
      numero: this.data.numero,
      nameUseratencion: this.tokenStorage.getUser().name,
      Observaciones: this.observaciones,
      Radicado: this.Radicado
    };
  
    this.authService.RequestData(JSON.stringify(payload), "Trasladodeconversacion", "").subscribe({
      next: data => {
        this.userService.showSuccess(data.message, "Datos Ingresados", "success");
        setTimeout(() => this.cerrar(), 1000);
      },
      error: err => {
        this.userService.showSuccess("Error al trasladar los datos, comuníquese con el administrador", "Error", "error");
      }
    });
  }
  
  

  

  onSeleccionUsuarioUnico(event: any) {
    const selectionList: MatSelectionList = event.source;
    const selectedOptions: MatListOption[] = selectionList.selectedOptions.selected;
  
    // Si ya hay otro seleccionado, deseleccionamos todos excepto el actual
    if (selectedOptions.length > 1) {
      selectedOptions.forEach((opt: MatListOption) => {
        if (opt !== event.option) {
          opt.selected = false;
        }
      });
    }
  
    this.usuarioSeleccionado = event.option.value;
  }

  tiposDelUsuarioSeleccionado: any[] = [];

tiposAtencion = [
  { codigo: 'T', nombre: 'Todos' },
  { codigo: 'A', nombre: 'Ahorro a la vista' },
  { codigo: 'C', nombre: 'Créditos' },
  { codigo: 'E', nombre: 'Estados de cuenta' },
  { codigo: 'CP', nombre: 'Cotización de pólizas' },
  { codigo: 'CE', nombre: 'Certificados' },
  { codigo: 'DN', nombre: 'Descuentos de nómina' },
  { codigo: 'EC', nombre: 'Envío de consignaciones' },
  { codigo: 'CB', nombre: 'Compra Boletería de cine' },
  { codigo: 'CA', nombre: 'Comunicarse con asesor' }
];

seleccionarUsuario(user: any) {
  this.usuarioSeleccionado = user;
  if (this.usuarioSeleccionado.tipo_atencion_desc == 'Todos')
    {
      user.tipo_atencion='A,C,E,CP,CE,DN,EC,CB,CA'
    }

  if (user.tipo_atencion_desc) {
    const codigos = user.tipo_atencion.split(',').map((cod: string) => cod.trim());
    this.tiposDelUsuarioSeleccionado = this.tiposAtencion.filter(op => codigos.includes(op.codigo));
  } else {
    this.tiposDelUsuarioSeleccionado = [];
  }
}


  
  
  
}
