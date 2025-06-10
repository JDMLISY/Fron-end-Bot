// import { Component, OnInit } from '@angular/core';
// import Chart from 'chart.js/auto'
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { AuthService } from '../_services/auth.service';
// import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
// import { ErrorStateMatcher } from '@angular/material/core';
// import { UserService } from '../_services/user.service';
// import ChartDataLabels from 'chartjs-plugin-datalabels';




// @Component({
//   selector: 'app-doughnut',
//   templateUrl: './doughnut.component.html',
//   styleUrls: ['./doughnut.component.css']
// })
// export class DoughnutComponent implements OnInit {
//   public chart: any;
//   public numeric: string[] = []
//   public datalabel: string[] = []

//   constructor(private userService: UserService, public dialog: MatDialog, private authService: AuthService, private formBuilder: FormBuilder) { }


  
//   ngOnInit(): void {
//     this.createChart();




//   }

//   createChart() {

//     this.authService.RequestData("", 'Solicitudescharjs', "").subscribe({
//       next: data => {
//         if (data.Codigo == '401') {

//           this.authService.conexiontoken(data.Mensaje)
//           return
//         } else {
//           var ini = 0
//           var fin = data.length


//           while (ini >= 0 && ini < fin) {
//             this.numeric.push(data[ini].count)
//             this.datalabel.push(data[ini].Tipo_atencion)

//             ini++
//           }

//         }



//         // this.userService.showSuccess(data.message,"Datos Ingresados",'success')
//         this.chart = new Chart("MyChart", {
//           type: 'doughnut', //this denotes tha type of chart

//           data: {// values on X-Axis
//             labels: this.datalabel,
//             datasets: [{    
                        
//               data: this.numeric,
//               backgroundColor: [
//                 '#E15D44',
//                 '#55B4B0',
//                 '#DFCFBE',
//                 '#e5e7e9',
//                 '#f1313a',
//                 '#b5ff33',
//                 '#33f0ff',
//                 '#6133ff'

//               ],
              
//               hoverOffset: 1
              
//             }],
            
//           },

          
//           plugins: [ChartDataLabels],
//           options: {
            
//             aspectRatio: 3.5,
//             plugins: {
            
//               datalabels: {
//                 formatter: function(value, context) {
//                   return 
//                 },

//                 borderColor: 'white',
//                 borderRadius: 25,
//                 borderWidth: 20,
//                 color: 'black',
               

//                               }
//             }
//           }
         
          
//         });


//       },
//       error: err => {

//         this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
//       }
//     });


//   }


// }


import { Component, OnInit,ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { FormBuilder } from '@angular/forms';
import { FlujoConversacionalComponent } from '../flujo-conversacional/flujo-conversacional.component';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit {

  kpis: { title: string; value: string | number; icon: string }[] = [];

  totalSolicitudes: number = 0;
solicitudesHoy: number = 0;
promedioAtencion: string = '0 min';
resueltas: string = '0%';
  
  public chart: any;
  public numeric: number[] = [];
  public datalabel: string[] = [];

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // Registrar componentes de Chart.js necesarios
    Chart.register(...registerables, ChartDataLabels);
    this.createChart();
    this.createDashboardCards()
  }

  createChart() {
    this.authService.RequestData("", 'Solicitudescharjs', "").subscribe({
      next: data => {
        if (data.Codigo == '401') {
          this.authService.conexiontoken(data.Mensaje);
          return;
        }

        this.numeric = [];
        this.datalabel = [];

        for (let i = 0; i < data.length; i++) {
          this.numeric.push(data[i].count);
          this.datalabel.push(data[i].Tipo_atencion);
        }

        if (this.chart) {
          this.chart.destroy();  // destruir chart anterior si existe para evitar duplicados
        }

        this.chart = new Chart("MyChart", {
          type: 'doughnut',
          data: {
            labels: this.datalabel,
            datasets: [{
              data: this.numeric,
              backgroundColor: [
                '#E15D44',
                '#55B4B0',
                '#DFCFBE',
                '#e5e7e9',
                '#f1313a',
                '#b5ff33',
                '#33f0ff',
                '#6133ff'
              ],
              hoverOffset: 10
            }]
          },
          options: {
            aspectRatio: 3.5,
            plugins: {
              datalabels: {
                formatter: (value, context) => {
                  return value;  // mostrar valor en la etiqueta
                },
                color: 'black',
                borderRadius: 4,
                font: {
                  weight: 'bold',
                  size: 14
                },
                padding: 6
              },
              legend: {
                display: true,
                position: 'bottom'
              }
            }
          },
          plugins: [ChartDataLabels]
        });

      },
      error: err => {
        this.userService.showSuccess("Error al consultar los datos, Comuníquese con el Administrador del sistema...", "Error de comunicación", 'Error');
      }
    });
  }

  createDashboardCards() {
    this.authService.RequestData("", 'DashboardCards', "").subscribe({
      next: data => {
        if (data.Codigo === '401') {
          this.authService.conexiontoken(data.Mensaje);
          return;
        }
  
        // Asignas a variables individuales (opcional)
        this.totalSolicitudes = data.totalSolicitudes;
        this.solicitudesHoy = data.solicitudesHoy;
        this.resueltas = data.resueltas;
        const valorString = "12733 min";

// Extraer solo números (quita todo lo que no sea dígito)
const soloNumeros = valorString.replace(/\D/g, ''); // "12733"

// Convertir a número
const totalSegundos = Number(soloNumeros) || 0;


        

const horas = Math.floor(totalSegundos / 3600);
const minutos = Math.floor((totalSegundos % 3600) / 60);
const segundos = totalSegundos % 60;

let tiempoFormateado = '';

if (horas > 0) {
  tiempoFormateado = `${horas} h`;
  if (minutos > 0) tiempoFormateado += ` ${minutos} min`;
  if (segundos > 0) tiempoFormateado += ` ${segundos} seg`;
} else if (minutos > 0) {
  tiempoFormateado = `${minutos} min`;
  if (segundos > 0) tiempoFormateado += ` ${segundos} seg`;
} else {
  tiempoFormateado = `${segundos} seg`;
}

this.promedioAtencion = tiempoFormateado;


  
        // Actualizas el arreglo kpis para que el HTML se refresque con nuevos valores
        this.kpis = [
          { title: 'Solicitudes totales', value: this.totalSolicitudes, icon: 'assignment' },
          { title: 'Hoy', value: this.solicitudesHoy, icon: 'event' },
          { title: 'Promedio atención', value: this.promedioAtencion, icon: 'schedule' },
          { title: 'Resueltas', value: this.resueltas, icon: 'check_circle' },
        ];
      },
      error: err => {
        this.userService.showSuccess(
          "Error al consultar el resumen del dashboard. Comuníquese con el administrador.",
          "Error de comunicación",
          "Error"
        );
      }
    });
  }
  
}
