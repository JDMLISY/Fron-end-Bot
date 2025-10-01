import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-ver-compras',
  templateUrl: './modal-ver-compras.component.html',
  styleUrls: ['./modal-ver-compras.component.css']
})
export class ModalVerComprasComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalVerComprasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
