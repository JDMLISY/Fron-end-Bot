import { Injectable } from '@angular/core';
import { Result } from '@zxing/library';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";
import { DomSanitizer,SafeResourceUrl  } from '@angular/platform-browser';
import { TokenStorageService } from './_services/token-storage.service';
const Socket = environment.Socket;

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private sanitizer: DomSanitizer,private tokenStorage: TokenStorageService) {}
  
  socket = io(environment.Socket, {
    query: {
      nit: this.tokenStorage.getUser().Nit, // ⚠️ Asegúrate que `this.nit` esté definido correctamente
    },
    transports: ['websocket']
  });
  
  // socket = io(Socket, {   //desarrollo
  //   withCredentials: false,
  // query: {
  //   nit: this.tokenStorage.getUser().Nit
  // }
  // });

//  socket = io('https://whatsapp.soari.co:50000', {   //produccion
//     withCredentials: false
//   });
  

  public sendMessage(message: any) {
    console.log('sendMessage: ', message)
    this.socket.emit('message', message);
  }

  public notificacionesActivas = true; // <- bandera global


  public getNewMessage = () => {

    this.socket.on('message', (message) =>{
   
      console.log(`📩 [FRONT] Mensaje recibido en sala: ${message.nit}`, message);
      const nitActual = this.tokenStorage.getUser().Nit;

      // Mostrar el mensaje solo si pertenece a esta entidad
      if (message.nit !== nitActual) {
        return; // 🚫 Ignora mensajes de otras entidades
      }


      const numero = sessionStorage.getItem('numeroContacto');
      if (numero==message.numero)
        {
          this.message$.next(message);
          }

      if (message.Ruta_Archivo == 'S')
      {
      message.Mensaje = this.sanitizer.bypassSecurityTrustResourceUrl(message.Mensaje);
    }else
    {
      
        var regex = /(\d+)/g;
var mensaje = message.Mensaje
var datoradicado = message.Mensaje.match(regex)
if (this.notificacionesActivas) {
      Notification.requestPermission().then((Result) => {
      
      if (mensaje.indexOf("El número de radicado para tu solicitud es") > 0)
        {
      
           const notification=   new Notification( "Existen nuevos mensajes",{ 
                body: "Existe un mensaje, El cliente con número: " + message.numero + ", escribió:" + message.Mensaje,                
                icon: "..src/assets/icons/LogoMore.jpg"
           })

           
setTimeout(() => {
  notification.close();
}, 30000);
          }
        })
        
        }
      }
      

    });

    return this.message$.asObservable();
  };
}