import { Component } from '@angular/core';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent {
  aceptado = false;

  toggleAcepto(event: any) {
    this.aceptado = event.target.checked;
  }
}
