import { Component, OnInit,ChangeDetectorRef,ViewChild,Inject,AfterViewInit,ElementRef,HostListener } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AuthService } from '../_services/auth.service';
import { GestionSolicitudesComponent } from '../gestion-solicitudes/gestion-solicitudes.component'
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChatService } from '../web-socket.service';

export interface DialogData {
  idRegistro: string;
  Tipo_atencion: string;
  Radicado: string;
}

/**
 * @title List with selection
 */
@Component({
  selector: 'app-listas-asociados',
  templateUrl: './listas-asociados.component.html',
  styleUrls: ['./listas-asociados.component.css']
})
export class ListasAsociadosComponent implements OnInit {
  // typesOfShoes = Array.from({length: 1000}).map((_, i) => `Item #${i}`);
  displayedColumns: string[] = ['idRegistro','Tipo_atencion','Radicado','fecha_solicitud','Contactar'];
  dataSource = new MatTableDataSource()
  errorMessage = '';
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(CdkVirtualScrollViewport, {static: true}) viewport !: CdkVirtualScrollViewport;
  

  @ViewChild('container') private myScrollContainer !: ElementRef;

  isShow = true;
  topPosToStartShowing = 100;
  


  itemList : number[]=[];

  
  newMessage = '';
  messageList: string[] = [];


 
  

 




  verconversacion = false
  Solicitudes =false 
  DatosUsuario: string[] = [];
  windowScrolled = false;
  imagePreview : any 
  selectedFiles?: FileList;
  currentFile?: File;
  ngAfterViewInit() {
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.chatService.getNewMessage().subscribe((message: string) => {
      
    
      this.Conversa = [...this.Conversa, {message}];
      this.Conversa.push(message)
      this.cdRef.detectChanges();
    // this.scrollToBottom(); 
      
    })
  }

  downloadFile(event: string){
    let link = document.createElement("a");
    link.download = event;
    link.target = "_blank";
    link.href = event;
    link.click();
}
selectFile(event: any): void {
  this.selectedFiles = event.target.files;
}
  scrollToBottom(): void {

    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight
  
  }


  typesOfShoes: string[] = [];
  public Conversa :  any[] = [];
  public Solicitudesproductos :  any[] = [];
  
  centered = true;
  disabled = false;
  unbounded = false;
  hidden = false;
  Cantidad = 0
  contacto = ""
  texto = ""
  numero = ""
  Cedula = ""
  timerId1 = ""
  objDiv=""


  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  constructor( private chatService: ChatService, private authService: AuthService, private cdRef: ChangeDetectorRef,   private userService: UserService, private tokenStorage: TokenStorageService, public dialog: MatDialog) {

    for(var i=0; i<100; i++){

      this.itemList.push(+i)

    }
    let identificadorDeTemporizador;

    this.userService.Solicitudes("Solicitudes", this.tokenStorage.getUser(),"Count","","").subscribe({
      next: data => {
        if (data.length > 0) {
          this.typesOfShoes = data
         this.numero = data[0].Numero_asociado
        //  this.limpiartiempo()

          return
        } else {
          if (data.Codigo == "401") {
            this.userService.showSuccess(data.Mensaje, "Error de comunicaciòn", 'Error')
            setTimeout(() => this.tokenStorage.signOut(), 20);
            return
          }

        
          if (data.message != undefined) {
            this.userService.showSuccess(data.message, "Consulta Solicitudes", 'info')
            
            return
          }

        }
      },
      error: err => {
        this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
      }
    })

  



  }



  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
filtrar_solicitudes (Nombre: string,numero:string, dedonde: string,Cedula:string)
{
  // this.limpiartiempo()
  this.verconversacion = false
  this.Solicitudes = true
  this.contacto = Nombre
  this.Cedula = Cedula
  this.userService.Solicitudes("Solicitudes", this.tokenStorage.getUser(),"Todas",numero,Cedula).subscribe({
    next: data => {
      if (data.length > 0) {
        this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
                
        return
      } else {
        if (data.Codigo == "401") {
          this.userService.showSuccess(data.Mensaje, "Error de comunicaciòn", 'Error')
          setTimeout(() => this.tokenStorage.signOut(), 20);
          return
        } else 
        {

          if (data.message != undefined) {
            this.userService.showSuccess(data.message, "Consulta Solicitudes", 'Warning')
            location.reload();
            return
          }

        }




       

      }
    },
    error: err => {
      this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
    }
  })
}


  ver_conversacion(Nombre: string,numero:string, dedonde: string) {
    this.verconversacion = true
    this.Solicitudes = false
    this.contacto = Nombre
    this.numero = numero
     this.userService.conversaciones("Conversaciones", this.tokenStorage.getUser(),numero).subscribe({
      next: data => {
        if (data.length > 0) {

          this.Conversa = data

          this.cdRef.detectChanges();
          this.scrollToBottom()

          
          // let identificadorDeTemporizador =  setInterval(() => this.userService.conversaciones("Conversaciones", this.tokenStorage.getUser(),this.numero).subscribe({
          //   next: data => {
          //     if (data.length > 0) {
      
          //       this.Conversa = data
      
          //       this.cdRef.detectChanges();
          //       this.scrollToBottom(); 
            
          
          //       return
          //     } else {
          //       if (data.Codigo == "401") {
          //         this.userService.showSuccess(data.Mensaje, "Error de comunicaciòn", 'Error')
          //         setTimeout(() => this.tokenStorage.signOut(), 20);
          //         return
          //       }
      
          //       this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
      
          //     }
          //   },
          //   error: err => {
          //     this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
          //   }
          // }), 9000);


          
          return
        } else {
          if (data.Codigo == "401") {
            this.userService.showSuccess(data.Mensaje, "Error de comunicaciòn", 'Error')
            setTimeout(() => this.tokenStorage.signOut(), 20);
            return
          }

          this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')

        }
      },
      error: err => {
        this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
      }
    })





//     this.userService.conversaciones("Conversaciones", this.tokenStorage.getUser(),numero).subscribe({
//       next: data => {
//         if (data.length > 0) {

//           this.Conversa = data

// //           if (dedonde== 'P')
// // {
// //             var obj2 = {Mensaje: "Prueba"};
// //           this.Conversa.push(obj2); 
// //           }
          
//           return
//         } else {
//           if (data.Codigo == "401") {
//             this.userService.showSuccess(data.Mensaje, "Error de comunicaciòn", 'Error')
//             setTimeout(() => this.tokenStorage.signOut(), 20);
//             return
//           }

//           this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')

//         }
//       },
//       error: err => {
//         this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
//       }
//     })

  }

  async enviar(numero: string){

    
    var obj2 = {Mensaje: this.texto};

   // this.Conversa.push(obj2); 
   this.Conversa = [...this.Conversa, {"Mensaje": this.texto,"dedonde": "WEB"}];
    
   this.cdRef.detectChanges();
   this.scrollToBottom(); 
     var mensaje =  this.texto
     this.texto = ""

    // this.Conversa.concat(obj2)
    // this.chatService.getNewMessage().subscribe((message: string) => {
    //   this.messageList.push(message);
    // })

    // this.newMessage = mensaje
    // this.sendMessage()


     this.userService.Mensajeswhat("Mensajeswhat","Texto",mensaje,this.numero).subscribe({
      next: data => {
        if (data.length > 0) {

        //   this.Conversa = data
        //  // this.Conversa = [...this.Conversa, obj2];
        //  this.cdRef.detectChanges();
        // this.scrollToBottom(); 
        
         
     


         



//           if (dedonde== 'P')
// {
//             var obj2 = {Mensaje: "Prueba"};
//           this.Conversa.push(obj2); 
//           }
          
          return
        } else {
          if (data.Codigo == "401") {
            this.userService.showSuccess(data.Mensaje, "Error de comunicaciòn", 'Error')
            setTimeout(() => this.tokenStorage.signOut(), 20);
            return
          }

          this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')

        }
      },
      error: err => {
        this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
      }
    })

   
    
   

  }


  applyFilter(event: Event) {
    
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }




  }

  openDialog(): void {
    const dialogRef = this.dialog.open(GestionSolicitudesComponent, {
      height: '500px',
      width: '750px',
      data:  this.dataSource,
    });
   
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.verconversacion = result
        this.Solicitudes = true
        this.filtrar_solicitudes (this.contacto,this.numero, '',this.Cedula)
      }
    });
}

// limpiartiempo() {

//   clearTimeout(this.timerId1);
// }


//  borrarAlerta() {
//   clearTimeout(identificadorDeTemporizador);
// }

traer_archivo(parametro :string ) {
  this.authService.downloadFile(parametro,this.numero).subscribe((blob) => {
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = 'file.xlsx';
    a.click();
    URL.revokeObjectURL(objectUrl);
    this.userService.showSuccess("Descarga Realizada Correctamente","Descarga de Archivo",'success')
  });
  }
}






