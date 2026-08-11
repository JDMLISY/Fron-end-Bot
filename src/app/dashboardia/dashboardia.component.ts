import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboardia',
  templateUrl: './dashboardia.component.html',
  styleUrls: ['./dashboardia.component.css']
})
export class DashboardiaComponent implements OnInit {

  totalAgentes = 0;
  totalModelos = 0;
  totalHerramientas = 0;
  conversaciones = 0;

  agentes = [
    {
      nombre: 'Asistente Comercial',
      modelo: 'GPT-5.5',
      estado: 'Activo',
      conversaciones: 0
    },
    {
      nombre: 'Servicio al Cliente',
      modelo: 'GPT-5.5',
      estado: 'Activo',
      conversaciones: 0
    }
  ];

  actividad = [
    {
      hora: '09:15',
      descripcion: 'Dashboard inicializado'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}