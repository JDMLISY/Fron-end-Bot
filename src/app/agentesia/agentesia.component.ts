import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-agentesia',
  templateUrl: './agentesia.component.html',
  styleUrls: ['./agentesia.component.css']
})
export class AgentesiaComponent implements OnInit {
  mensajes: any[] = [];

  mensaje = "";
  
  agenteSeleccionado: any = null;
  
  respuesta = "";
  
  tokens = 0;
  
  modelo = "";
  
  tiempo = 0;


  displayedColumns = [
    'Nombre',
    'Modelo',
    'Activo'
  ];

  dataSource = new MatTableDataSource<any>([]);

  modelos: any[] = [];

  agente: any = {};

  constructor( private authService: AuthService,private userService: UserService){}

  ngOnInit(): void {

    this.nuevo();

    this.listarModelos();

    this.listar();

  }

  nuevo() {

    this.agente = {

      IdAgente: 0,

      Nombre: '',

      Descripcion: '',

      IdModelo: null,

      MensajeBienvenida:
`Hola 👋

Bienvenido.

¿En qué puedo ayudarte?`,

      MenuPrincipal:
`[
  {
    "id":"1",
    "title":"Créditos",
    "description":"Solicitud e información"
  },
  {
    "id":"2",
    "title":"Estados de cuenta",
    "description":"Consultar estados"
  }
]`,

      PromptBase:
`Eres un asistente virtual.

Responde siempre en español.

Nunca inventes información.

Cuando el usuario salude utiliza el MensajeBienvenida y el MenuPrincipal.

Si el usuario selecciona una opción continúa la conversación hasta obtener toda la información necesaria.`,

      Temperatura: 0.2,

      MaxTokens: 1000,

      Activo: true

    };

  }

listar(){

    this.authService.RequestDataobject(

        {

            accion:"listar"

        },

        "AgentesIA",

        ""

    ).subscribe((resp:any)=>{

        this.dataSource.data=resp;

    });

}

listarModelos(){

  this.authService.RequestDataobject(

      {

          accion:"listarModelos"

      },

      "PlaygroundIA",

      ""

  ).subscribe((resp:any)=>{

      this.modelos=resp;

  });

}

guardar() {

  if (!this.agente.Nombre || this.agente.Nombre.trim() === "") {

      this.userService.showSuccess(

          "Debe ingresar el nombre del agente.",

          "Agentes IA",

          "warning"

      );

      return;

  }

  if (!this.agente.Descripcion || this.agente.Descripcion.trim() === "") {

      this.userService.showSuccess(

          "Debe ingresar una descripción.",

          "Agentes IA",

          "warning"

      );

      return;

  }

  if (!this.agente.IdModelo) {

      this.userService.showSuccess(

          "Debe seleccionar un modelo IA.",

          "Agentes IA",

          "warning"

      );

      return;

  }

  if (!this.agente.MensajeBienvenida || this.agente.MensajeBienvenida.trim() === "") {

      this.userService.showSuccess(

          "Debe ingresar el mensaje de bienvenida.",

          "Agentes IA",

          "warning"

      );

      return;

  }

  if (!this.agente.MenuPrincipal || this.agente.MenuPrincipal.trim() === "") {

      this.userService.showSuccess(

          "Debe ingresar el menú principal.",

          "Agentes IA",

          "warning"

      );

      return;

  }

  if (!this.agente.PromptBase || this.agente.PromptBase.trim() === "") {

      this.userService.showSuccess(

          "Debe ingresar el Prompt Base.",

          "Agentes IA",

          "warning"

      );

      return;

  }

  this.authService.RequestDataobject(

      {

          accion: "guardar",

          ...this.agente

      },

      "AgentesIA",

      ""

  ).subscribe((resp: any) => {

      this.userService.showSuccess(

          resp.message,

          "Agentes IA",

          "success"

      );

      this.listar();

      this.nuevo();

  });

}

eliminar(){

  if(this.agente.IdAgente==0){

      return;

  }

  this.authService.RequestDataobject(

      {

          accion:"eliminar",

          IdAgente:this.agente.IdAgente

      },

      "AgentesIA",

      ""

  ).subscribe((resp:any)=>{

      this.userService.showSuccess(

          resp.message,

          "Agentes IA",

          "success"

      );

      this.listar();

      this.nuevo();

  });

}

  seleccionar(row:any){

      this.agente = { ...row };

  }

}