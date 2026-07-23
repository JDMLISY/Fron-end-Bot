import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



@Component({
    selector: 'app-estadisticascampanias',
    templateUrl: './estadisticascampanias.component.html',
    styleUrls: ['./estadisticascampanias.component.css']
})


export class EstadisticascampaniasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    filtroCampania = "";

    fechaInicial!: Date;

    fechaFinal!: Date;

    totalCampanias = 0;

    totalMensajes = 0;

    totalEntregados = 0;

    totalLeidos = 0;

    totalErrores = 0;
    totalEnviados =  0;
    displayedColumns = [
      'NombreCampania',
      'Fecha',
      'Contactos',
      'Enviados',
      'Entregados',
      'Leidos',
      'Errores'
  ];

    dataSource = new MatTableDataSource<any>([]);

    constructor(private authService: AuthService,private userService: UserService) { }

    ngOnInit(): void {

        this.cargarEstadisticas();

    }

    cargarEstadisticas() {

      const newData = {
  
          accion: 'estadisticas',
  
          campania: this.filtroCampania,
          desde: this.fechaInicial,
          hasta: this.fechaFinal
  
      };
  
      this.authService.RequestDataobject(
  
          newData,
          'EstadisticasCampanias',
          ''
  
      ).subscribe({
  
          next: (resp: any) => {
  
              if (!resp.ok) {
  
                  console.log(resp.mensaje);
                  return;
  
              }
  
              //==========================
              // TOTALES
              //==========================
  
              this.totalCampanias  = resp.totales.TotalCampanias;
              this.totalMensajes   = resp.totales.TotalMensajes;
              this.totalEnviados   = resp.totales.Enviados;
              this.totalEntregados = resp.totales.Entregados;
              this.totalLeidos     = resp.totales.Leidos;
              this.totalErrores    = resp.totales.Errores;
  
              //==========================
              // TABLA
              //==========================
              this.dataSource.data = resp.detalle;

              setTimeout(() => {
              
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
              
              });
      
          },
  
          error: err => {
  
              console.log(err);
  
          }
  
      });
  
  }


  filtrarTabla(event: Event) {

    const filtro = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filtro.trim().toLowerCase();

}
    verDetalle(row: any) {

        console.log(row);

        // Abriremos el detalle de la campaña

    }

}