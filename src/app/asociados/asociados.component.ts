
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../_services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalVerComprasComponent } from '../modal-ver-compras/modal-ver-compras.component';
import { ModalVerCuposComercioComponent } from '../modal-ver-cupos-comercio/modal-ver-cupos-comercio.component';
import { ModalActualizarAsociadoComponent } from '../modal-actualizar-asociado/modal-actualizar-asociado.component';
import { ListasAsociadosComponent } from '../listas-asociados/listas-asociados.component';




@Component({
  selector: 'app-asociados',
  templateUrl: './asociados.component.html',
  styleUrls: ['./asociados.component.css']
})
export class AsociadosComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'Cedula', 'Compras', 'cupos', 'actualizar', 'contactar'];
  dataSource = new MatTableDataSource<any>([]);
  searchValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarAsociados();
  }

  cargarAsociados(): void {
    this.authService.RequestData('', 'panelasociados', '').subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;

        // 🔍 Filtro por nombre o cédula
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const normalizedFilter = filter.trim().toLowerCase();
          const nombre = data.Nombre?.toLowerCase() || '';
          const cedula = data.Cedula?.toString().toLowerCase() || '';
          return nombre.includes(normalizedFilter) || cedula.includes(normalizedFilter);
        };
      },
      error: (err) => {
        console.error('Error cargando asociados', err);
      }
    });
  }

  // 🔍 Aplicar filtro
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue;
  }

  // ❌ Limpiar filtro
  clearFilter() {
    this.searchValue = '';
    this.dataSource.filter = '';
  }

  verCompras(identificacion: string) {
    this.authService.RequestData(identificacion, 'solicitudesComersio', identificacion).subscribe({
      next: (resp) => {
        this.dialog.open(ModalVerComprasComponent, {
          width: '600px',
          data: { compras: resp }
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

  


  contactar(asociado: any): void {
    this.dialog.open(ListasAsociadosComponent, {
      width: '1900px',
      data: {
        nombre: asociado.Nombre,
        numero: '57'+ asociado.Celular,
        dedonde: 'asociados',
        radicado: asociado.Radicado || ''
      }
    });
  }

  actualizar(asociado: any): void {
    const dialogRef = this.dialog.open(ModalActualizarAsociadoComponent, {
      width: '500px',
      data: { ...asociado } // 👈 enviamos los datos actuales del asociado
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Datos actualizados:', result);
  
        // Aquí puedes enviar los datos al backend
        this.authService.RequestData(result, 'actualizarAsociado', asociado.Cedula).subscribe({
          next: (resp) => {
            console.log('Asociado actualizado con éxito:', resp);
            this.cargarAsociados();
          },
          error: (err) => {
            console.error('Error actualizando asociado:', err);
          }
        });
      }
    });
  }
  
}


// import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatTableDataSource } from '@angular/material/table';
// import { AuthService } from '../_services/auth.service';
// import { MatDialog } from '@angular/material/dialog';
// import { ModalVerComprasComponent } from '../modal-ver-compras/modal-ver-compras.component';
// import { ModalVerCuposComercioComponent } from '../modal-ver-cupos-comercio/modal-ver-cupos-comercio.component';



// @Component({
//   selector: 'app-asociados',
//   templateUrl: './asociados.component.html',
//   styleUrls: ['./asociados.component.css']
// })
// export class AsociadosComponent implements OnInit {
//   displayedColumns: string[] = ['nombre','Cedula', 'Compras', 'cupos', 'actualizar', 'contactar'];
//   dataSource = new MatTableDataSource<any>([]);

//   @ViewChild(MatPaginator) paginator!: MatPaginator;

//   constructor(private authService: AuthService,private dialog: MatDialog) {}
//   searchValue: string = '';

//   ngOnInit(): void {
//     this.cargarAsociados();
//   }
// // 🔍 Filtro por nombre
// applyFilter(event: Event) {
//   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
//   this.searchValue = filterValue;

//   this.dataSource.filterPredicate = (data: any, filter: string) => {
//     // Cambia "Nombre" si tu propiedad del backend tiene otro nombre
//     return data.Nombre?.toLowerCase().includes(filter);
//   };

//   this.dataSource.filter = filterValue;
// }

// // ❌ Limpiar filtro
// clearFilter() {
//   this.searchValue = '';
//   this.dataSource.filter = '';
// }

//   cargarAsociados(): void {
//     this.authService.RequestData('', 'panelasociados', '').subscribe({
//       next: (data) => {
//         this.dataSource = new MatTableDataSource(data);
//         this.dataSource.paginator = this.paginator;
//       },
//       error: (err) => {
//         console.error('Error cargando asociados', err);
//       }
//     });
//   }


//   verCompras(identificacion: string) {
//     this.authService.RequestData(identificacion, 'solicitudesComersio', identificacion).subscribe({
//       next: (resp) => {
//         this.dialog.open(ModalVerComprasComponent, {
//           width: '600px',
//           data: { compras: resp } // 👈 los datos que llegan del backend
//         });
//       },
//       error: (err) => {
//         console.error('Error cargando solicitudes', err);
//       }
//     });
//   }

  
//   verCuposComercio(cedula: string) {
//     this.authService.RequestData(cedula, 'cuposcomercio', cedula).subscribe({
//       next: (resp) => {
//         this.dialog.open(ModalVerCuposComercioComponent, {
//           width: '800px',
//           data: { cupos: resp }
//         });
//       },
//       error: (err) => {
//         console.error('Error cargando cupos comercio', err);
//       }
//     });
//   }
  

//   actualizar(asociado: any): void {
//     console.log('Actualizar asociado:', asociado);
//     this.cargarAsociados();
//   }

//   contactar(asociado: any): void {
//     console.log('Contactar a:', asociado);
//     // Aquí disparas el flujo de contacto (ej. enviar mensaje por WhatsApp)
//   }
// }
