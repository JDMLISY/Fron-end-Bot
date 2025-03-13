import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from '../_services/user.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';




@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit {
  public chart: any;
  public numeric: string[] = []
  public datalabel: string[] = []

  constructor(private userService: UserService, public dialog: MatDialog, private authService: AuthService, private formBuilder: FormBuilder) { }


  
  ngOnInit(): void {
    this.createChart();




  }

  createChart() {

    this.authService.RequestData("", 'Solicitudescharjs', "").subscribe({
      next: data => {
        if (data.Codigo == '401') {

          this.authService.conexiontoken(data.Mensaje)
          return
        } else {
          var ini = 0
          var fin = data.length


          while (ini >= 0 && ini < fin) {
            this.numeric.push(data[ini].count)
            this.datalabel.push(data[ini].Tipo_atencion)

            ini++
          }

        }



        // this.userService.showSuccess(data.message,"Datos Ingresados",'success')
        this.chart = new Chart("MyChart", {
          type: 'doughnut', //this denotes tha type of chart

          data: {// values on X-Axis
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
              
              hoverOffset: 1
              
            }],
            
          },

          
          plugins: [ChartDataLabels],
          options: {
            
            aspectRatio: 3.5,
            plugins: {
            
              datalabels: {
                formatter: function(value, context) {
                  return 
                },

                borderColor: 'white',
                borderRadius: 25,
                borderWidth: 20,
                color: 'black',
               

                              }
            }
          }
         
          
        });


      },
      error: err => {

        this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
      }
    });


  }


}
