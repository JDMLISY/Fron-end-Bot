import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-ver-cupos-comercio',
  templateUrl: './modal-ver-cupos-comercio.component.html',
  styleUrls: ['./modal-ver-cupos-comercio.component.css']
})
export class ModalVerCuposComercioComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalVerCuposComercioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  displayedColumns: string[] = [
    'Nombre', 'Empresa', 'Credito', 'Prima', 'Bonificacion',
    'Credito_inicial', 'Prima_inicial', 'Bonificacion_inicial', 'Estado', 'FechaRegistro'
  ];
  
  cerrar(): void {
    this.dialogRef.close();
  }
}
