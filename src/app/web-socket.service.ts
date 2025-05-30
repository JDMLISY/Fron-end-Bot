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
  

  socket = io(Socket, {   //desarrollo
    withCredentials: false
  });

//  socket = io('https://whatsapp.soari.co:50000', {   //produccion
//     withCredentials: false
//   });
  

  public sendMessage(message: any) {
    console.log('sendMessage: ', message)
    this.socket.emit('message', message);
  }

  public getNewMessage = () => {

    this.socket.on('message', (message) =>{
      
      const numero = sessionStorage.getItem('numeroContacto');
      if (numero==message.numero)
        {
          this.message$.next(message);
      if (message.Ruta_Archivo == 'S')
      {
      message.Mensaje = this.sanitizer.bypassSecurityTrustResourceUrl(message.Mensaje);
    }else
    {
      
        var regex = /(\d+)/g;
var mensaje = message.Mensaje
var datoradicado = message.Mensaje.match(regex)

      Notification.requestPermission().then((Result) => {


      })
      if (mensaje.indexOf("El número de radicado para tu solicitud es") > 0)
        {
      
           const notification=   new Notification( "Existen nuevas solicitudes",{ 
                body: "Existe una nueva solicitud, El número de radicado para tu solicitud es: " + datoradicado[0],
                icon: "..src/assets/icons/LogoMore.jpg"
           })

           
setTimeout(() => {
  notification.close();
}, 30000);
          }
        }
      }

    });

    return this.message$.asObservable();
  };
}