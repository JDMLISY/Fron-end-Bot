import { Component, OnInit,HostListener } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
export interface MensajeRespuesta {
  idregistros?: number;
  codigomensaje: string;
  mensaje: string;
  fecha?: Date;
  usuarioregistra: string;
}

@Component({
  selector: 'app-mensajes-respuesta',
  templateUrl: './mensajes-respuesta.component.html',
  styleUrls: ['./mensajes-respuesta.component.css']
})
export class MensajesRespuestaComponent implements OnInit {
  

  mostrarEmojiPicker = false;

  toggleEmojiPicker(): void {
    this.mostrarEmojiPicker = !this.mostrarEmojiPicker;
  }

  agregarEmoji(event: any): void {
    this.mensaje.mensaje += event.emoji.native;
    this.mostrarEmojiPicker = false;
  }

  @HostListener('document:click', ['$event'])
  clickFuera(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Si el click NO es dentro del botón o del picker, se cierra
    if (!target.closest('.emoji-container')) {
      this.mostrarEmojiPicker = false;
    }
  }
  listaCodigos = [
    { codigo: 'SALUDO', nombre: 'Mensaje de saludo' },
    { codigo: 'POLITICAS', nombre: 'Mensaje de políticas' },
    { codigo: 'AHORROS', nombre: 'Mensaje de ahorros' },
    { codigo: 'CREDITOS', nombre: 'Mensaje de créditos' },
    { codigo: 'ESTADO_CUENTA', nombre: 'Estado de cuentas' },
    { codigo: 'COTIZACION_POLIZAS', nombre: 'Cotización de pólizas' },
    { codigo: 'CERTIFICADOS', nombre: 'Certificados' },
    { codigo: 'DESCUENTOS_NOMINA', nombre: 'Descuentos de nómina' },
    { codigo: 'ENVIO_CONSIGNACIONES', nombre: 'Envío de consignaciones' },
    { codigo: 'COMPRA_BOLETERIA', nombre: 'Compra de boletería' },
    { codigo: 'INFORMACION', nombre: 'Información' },
    { codigo: 'ASESOR', nombre: 'Comunicarse con un asesor' },
    { codigo: 'SALIDA', nombre: 'Mensaje de Salida' },
    { codigo: 'FUERA_HORARIO', nombre: 'Mensaje de fuera de horario' },
    { codigo: 'FUERA_HORARIO_ALMUERZO', nombre: 'Mensaje de fuera de horario almuerzo' },
    { codigo: 'EN_HORARIO', nombre: 'Mensaje de horario laboral' },
    { codigo: 'VALIDAR_OPCION_MENU', nombre: 'Mensaje de validación en selección de menu' },    
    { codigo: 'VALIDAR_IDENTIFICACION', nombre: 'Mensaje de validación para ingreso de identificación' },
    { codigo: 'VALIDAR_NUMEROS', nombre: 'Mensaje de validación numeros o valores' },
    


  ];

  mensaje: MensajeRespuesta = {
    codigomensaje: '',
    mensaje: '',
    usuarioregistra: ''
  };

  constructor( private userService: UserService, private authService: AuthService,private dialogRef: MatDialogRef<MensajesRespuestaComponent>,private tokenStorageService: TokenStorageService) { }


  consultardatos(codigo: string):void{


    this.authService.RequestData(codigo,'consultarmensajebot', '')
    .subscribe({
      next: (res) => {
        console.log('✅ Mensaje guardado:', res);
        
        this.mensaje.mensaje =res.data.mensaje;

        // Puedes asignar otros campos si quieres
        this.mensaje.codigomensaje = res.data.codigomensaje;
        this.mensaje.usuarioregistra = res.data.usuarioregistra;
      },
      error: (err) => {
        this.userService.showSuccess("❌  Consultar mensaje: " + err.error.message, "Registro mensajes",'warning')  
        this.mensaje.mensaje ="";
      }
    });


  }


  ngOnInit(): void {
    const user = this.tokenStorageService.getUser();
    this.mensaje.usuarioregistra = user.name;
  }

  guardar(): void {
    const user = this.tokenStorageService.getUser();
    if (!this.mensaje.codigomensaje || !this.mensaje.mensaje ) {
      alert('Todos los campos son obligatorios');
      return;
    }

    
      const newData = {
        codigomensaje: this.mensaje.codigomensaje,
        mensaje: this.mensaje.mensaje,
        usuarioregistra: user.name
      };
    
      this.authService.RequestDataobject(newData, 'guardarmensajesbot', '')
        .subscribe({
          next: (res) => {
            console.log('✅ Mensaje guardado:', res);
            this.userService.showSuccess("✅ Mensaje guardado","Registro mensajes",'success')              
            this.limpiar(); // limpiar campos si quieres
          },
          error: (err) => {
            this.userService.showSuccess("✅❌ Error al guardar mensaje:" + err.error.message,"Registro mensajes",'Error')  
            
          }
        });
    
    
    this.limpiar();
  }

  limpiar(): void {
    const user = this.tokenStorageService.getUser();
    this.mensaje = {
      codigomensaje: '',
      mensaje: '',
      usuarioregistra: user.name
    };
  }
  salir(): void {
    this.dialogRef.close(); // cierra el modal
  }

}

