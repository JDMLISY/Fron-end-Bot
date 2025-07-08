import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-matricula-ayudas',
  templateUrl: './matricula-ayudas.component.html',
  styleUrls: ['./matricula-ayudas.component.css']
})
export class MatriculaAyudasComponent implements OnInit {
  ayudas: any[] = [];
  ayuda: any = { Titulo: '', Contenido: '', Tipo: '' };
  tiposAyuda = [
    { valor: 'saludo', nombre: 'Saludo' },
    { valor: 'info', nombre: 'Información' },
    { valor: 'Pre', nombre: 'Pregunta' },
    { valor: 'cierre', nombre: 'Cierre' },
    { valor: 'alerta', nombre: 'Alerta' },
    { valor: 'recordatorio', nombre: 'Recordatorio' },
  ];
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.listarAyudas();
  }
  listarAyudas(): void {
    const payload = {
      accion: 'listar',
      
    };
  
    this.authService.RequestDataobject(payload, 'ayudasrapidas', '').subscribe({
      next: data => {
        this.ayudas = data;
      },
      error: err => {
        // this.userService.showSuccess("Error al listar las ayudas...", "Error", "error");
      }
    });
  }
  
  guardarAyuda(): void {
    const accion = this.ayuda.idregistro ? 'editar' : 'crear';
  
    const payload = {
      accion,      
      idregistro: this.ayuda.idregistro,      
      Contenido: this.ayuda.Contenido,
      Tipo: this.ayuda.Tipo    
    };
  
    this.authService.RequestDataobject(payload, 'ayudasrapidas', '').subscribe({
      next: data => {
        // this.userService.showSuccess("Guardado correctamente", "Éxito", "success");
        this.listarAyudas();
        this.ayuda = { Titulo: '', Contenido: '', Tipo: '' };
      },
      error: err => {
        // this.userService.showSuccess("Error al guardar la ayuda...", "Error", "error");
      }
    });
  }
  
  editarAyuda(item: any): void {
    this.ayuda = { ...item };
  }
  
  cancelar(): void {
    this.ayuda = { Titulo: '', Contenido: '', Tipo: '' };
  }
  
  eliminarAyuda(id: number): void {
    if (confirm('¿Deseas eliminar esta ayuda?')) {
      const payload = {
        accion: 'eliminar',        
        idregistro: id
      };
  
      this.authService.RequestDataobject(payload, 'ayudasrapidas', '').subscribe({
        next: () => this.listarAyudas(),
        error: err => {
          // this.userService.showSuccess("Error al eliminar la ayuda...", "Error", "error");
        }
      });
    }
  }
  
}

