import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

  constructor(
    public dialogRef: MatDialogRef<TrasladoConversacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
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
    if (this.usuarioSeleccionado) {
      this.dialogRef.close(this.usuarioSeleccionado);
    } else {
      alert('Selecciona un usuario primero');
    }
  }
}
