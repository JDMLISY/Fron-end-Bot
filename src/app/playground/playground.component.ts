import { Component, OnInit } from '@angular/core';

import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent {
    modo = "modelo";

    agentes: any[] = [];
    
    agenteSeleccionado = 0;

    systemPrompt =
`Eres un asistente útil.

Responde siempre en español.

Sé claro y breve.`;
  modelos: any[] = [];

  modeloSeleccionado = 0;
  
  mensaje = "";
  
 
  
  respuesta = "";
  
  temperatura: any = null;
  
  maxTokens: any = null;
  
  tokens = 0;
  
  tiempo = 0;
  
  modelo = "";
  proveedor = '';


  mensajes:any[]=[];
  
  constructor( private authService: AuthService,private userService: UserService){}
  ngOnInit(): void {

    this.listarModelos();
    

    this.listarAgentes();
}
listarAgentes() {

    this.authService.RequestDataobject(

        {

            accion: "listar"

        },

        "AgentesIA",

        ""

    ).subscribe({

        next: (resp: any) => {

            this.agentes = resp;

        }

    });

}
listarModelos() {

  this.authService.RequestDataobject(

      {

          accion: "listarModelos"

      },

      "PlaygroundIA",

      ""

  ).subscribe({

      next: (resp: any) => {

          this.modelos = resp;

      },

      error: (err) => {

          console.error(err);

          this.userService.showSuccess(

              "Error cargando los modelos.",

              "Playground IA",

              "error"

          );

      }

  });

}
enviar() {

    if(this.modo=="modelo"){

        if(!this.modeloSeleccionado){
    
            this.userService.showSuccess(
    
                "Seleccione un modelo.",
    
                "Playground IA",
    
                "warning"
    
            );
    
            return;
    
        }
    
    }else{
    
        if(!this.agenteSeleccionado){
    
            this.userService.showSuccess(
    
                "Seleccione un agente.",
    
                "Playground IA",
    
                "warning"
    
            );
    
            return;
    
        }
    
    }

  if (!this.mensaje.trim()) {

      this.userService.showSuccess(
          "Escriba un mensaje.",
          "Playground IA",
          "warning"
      );

      return;
  }

  // Guardamos el texto antes de limpiar
  const texto = this.mensaje;

  // Mostrar inmediatamente el mensaje del usuario
  this.mensajes.push({

      role: "user",

      content: texto

  });

  this.mensaje = "";


  this.authService.RequestDataobject(

      {

          accion: "preguntar",

          modo:this.modo,

          IdModelo:this.modeloSeleccionado,
      
          IdAgente:this.agenteSeleccionado,

          SystemPrompt:this.systemPrompt,

          Mensajes:this.mensajes,

          Temperatura: this.temperatura,

          MaxTokens: this.maxTokens

      },

      "PlaygroundIA",

      ""

  ).subscribe({

      next: (resp: any) => {

          console.log(resp);

          // Agregar respuesta de la IA
          this.mensajes.push({

              role: "assistant",

              content: resp.respuesta

          });
          this.proveedor = resp.proveedor;
          this.tokens = resp.totalTokens;

          this.modelo = resp.modelo;

          this.tiempo = resp.tiempo;

      },

      error: (err) => {

          console.error(err);

          this.userService.showSuccess(

              "Error consultando la IA.",

              "Playground IA",

              "error"

          );

      }

  });

}

  limpiarConversacion(){

      this.mensajes=[];

  }

  tecla(event: KeyboardEvent){

    if(event.key === 'Enter' && !event.shiftKey){

        event.preventDefault();

        this.enviar();

    }

}
cambiarModo(){

    this.limpiarConversacion();

}
}
