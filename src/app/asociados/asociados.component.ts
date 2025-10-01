import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../_services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalVerComprasComponent } from '../modal-ver-compras/modal-ver-compras.component';
import { ModalVerCuposComercioComponent } from '../modal-ver-cupos-comercio/modal-ver-cupos-comercio.component';



@Component({
  selector: 'app-asociados',
  templateUrl: './asociados.component.html',
  styleUrls: ['./asociados.component.css']
})
export class AsociadosComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'Compras', 'cupos', 'actualizar', 'contactar'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private authService: AuthService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarAsociados();
  }

  cargarAsociados(): void {
    this.authService.RequestData('', 'panelasociados', '').subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error cargando asociados', err);
      }
    });
  }


  verCompras(identificacion: string) {
    this.authService.RequestData(identificacion, 'solicitudesComersio', identificacion).subscribe({
      next: (resp) => {
        this.dialog.open(ModalVerComprasComponent, {
          width: '600px',
          data: { compras: resp } // 👈 los datos que llegan del backend
        });
      },
      error: (err) => {
        console.error('Error cargando solicitudes', err);
      }
    });
  }

  
  verCuposComercio(cedula: string) {
    this.authService.RequestData(cedula, 'cuposcomercio', cedula).subscribe({
      next: (resp) => {
        this.dialog.open(ModalVerCuposComercioComponent, {
          width: '800px',
          data: { cupos: resp }
        });
      },
      error: (err) => {
        console.error('Error cargando cupos comercio', err);
      }
    });
  }
  

  actualizar(asociado: any): void {
    console.log('Actualizar asociado:', asociado);
    this.cargarAsociados();
  }

  contactar(asociado: any): void {
    console.log('Contactar a:', asociado);
    // Aquí disparas el flujo de contacto (ej. enviar mensaje por WhatsApp)
  }
}
