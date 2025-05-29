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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';




export interface DialogData {
  idRegistro: string;
  Tipo_atencion: string;
  Radicado: string;
}

/**
 * @title List with selection
 */

interface TipoSolicitud {
  tipo_atencion: string;
  cantidad: number;
  contactos: {
    contacto: string;
    numero: string;
    identificacion: string;
    cantidad: number; // 👈 nuevo campo
    Tipo_atencion:string
  }[];
}
@Component({
  selector: 'app-listas-asociados',
  templateUrl: './listas-asociados.component.html',
  styleUrls: ['./listas-asociados.component.css']
})
export class ListasAsociadosComponent implements OnInit {
  hoveredItem: any = null;
  // typesOfShoes = Array.from({length: 1000}).map((_, i) => `Item #${i}`);
  displayedColumns: string[] = ['idRegistro','Tipo_atencion','Radicado','fecha_solicitud','Contactar'];
  dataSource = new MatTableDataSource()
  errorMessage = '';
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(CdkVirtualScrollViewport, {static: true}) viewport !: CdkVirtualScrollViewport;
  mostrarSelector: boolean = false;

  @ViewChild('emojiPicker') emojiPicker!: ElementRef;

  toggleSelector() {
    this.mostrarSelector = !this.mostrarSelector;
  }
  

  @ViewChild('container') private myScrollContainer !: ElementRef;

  files: File[] = [];
  fileUrl: SafeUrl | null = null;
  imageSrc: string | ArrayBuffer | null = null;

  selectedFile: File | null = null;
  
  


  isShow = true;
  topPosToStartShowing = 100;
  


  itemList : number[]=[];

  
  newMessage = '';
  messageList: string[] = [];

  archivo ="";
  safeUrl = "";
 
  
  typesOfShoes: TipoSolicitud[] = [];



  
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
   //  this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(message.Mensaje);
      this.cdRef.detectChanges();
     this.scrollToBottom(); 
     this.cargarSolicitudes();
    })
  }

  downloadFile(event: string){
    let link = document.createElement("a");
    link.download = event;
    link.target = "_blank";
    link.href = event;
    link.click();
}

  scrollToBottom(): void {
    // this.viewport.scrollToIndex(this.typesOfShoes.length -1);
    
    if (this.myScrollContainer !=undefined) {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight
    
          } 


    //this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight
  
  }


  
 
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
  hoveredTipo: string | null = null;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
 
  constructor( private http: HttpClient,private sanitizer: DomSanitizer,private chatService: ChatService, private authService: AuthService, private cdRef: ChangeDetectorRef,   private userService: UserService, private tokenStorage: TokenStorageService, public dialog: MatDialog) {

    for(var i=0; i<100; i++){

      this.itemList.push(+i)

    }
 
    
  
 }

 cargarSolicitudes() {
  const user = this.tokenStorage.getUser();

  this.userService.Solicitudes("Solicitudes", user.tipo_atencion, "Count", "", "","").subscribe({
    next: (response: any) => {
      if (Array.isArray(response)) {
        if (response.length > 0) {
          // Aquí response es un arreglo con datos
          this.typesOfShoes = response.map((t: any) => ({
            tipo_atencion: t.contacto,       // según tu query en SQL
            cantidad: t.Numero_Conversaciones,
            contactos: []                   // cargarás en otra llamada
          }));
  
          // Llama a obtener asociados, como haces en tu flujo actual
          this.userService.Solicitudes("Solicitudes", user.tipo_atencion, "ConAso", "", "","").subscribe({
            next: (asociados: any[]) => {
              // Combinas contactos en typesOfShoes
              this.typesOfShoes = this.typesOfShoes.map(tipo => ({
                ...tipo,
                contactos: asociados.filter(a => a.Tipo_atencion === tipo.tipo_atencion).map(c => ({
                  contacto: c.contacto,
                  numero: c.Numero_asociado,
                  identificacion: c.identificacion,
                  cantidad: c.Cantidad, 
                  Tipo_atencion: c.Tipo_atencion
                }))
              }));
            },
            error: err => {
              this.userService.showSuccess("Error al obtener asociados", "Error", "error");
            }
          });
  
        } else {
          // arreglo vacío
          this.userService.showSuccess("No existen datos de solicitudes", "Info", 'info');
        }
      } else if (response && typeof response === 'object') {
        // Aquí es el objeto con mensaje o error
        if (response.message) {
          this.userService.showSuccess(response.message, "Información", 'info');
        } else if (response.error) {
          this.userService.showSuccess(response.error, "Error", 'error');
        } else {
          this.userService.showSuccess("Respuesta inesperada del servidor", "Error", 'error');
        }
      } else {
        this.userService.showSuccess("Respuesta inesperada del servidor", "Error", 'error');
      }
    },
    error: err => {
      this.userService.showSuccess("Error al consultar los datos...", "Error de comunicación", 'Error');
    }
  });
  
}




 

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }


filtrar_solicitudes (Nombre: string,numero:string,Cedula:string,Tipo_atencion:string)
{

  const user = this.tokenStorage.getUser();
  // this.limpiartiempo()
  this.verconversacion = false
  this.Solicitudes = true
  this.contacto = Nombre
  this.Cedula = Cedula
  this.userService.Solicitudes("Solicitudes", user.tipo_atencion,"Todas",numero,Cedula,Tipo_atencion).subscribe({
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
  const user = this.tokenStorage.getUser();
     this.userService.conversaciones("Conversaciones", numero).subscribe({
      next: data => {
        if (data.length > 0) {

          for (let message of data) {
            if (message.Ruta_Archivo === 'S') {
              const url = message.Mensaje;
              const extension = url.split('.').pop()?.toLowerCase().replaceAll(" ",""); // obtiene 'pdf', 'mp4', etc.
          
              switch (extension) {
                case 'pdf':
                  message.tipoarchivo = 'application/pdf';
                  message.Mensaje = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                  break;
                case 'mp4':
                  message.tipoarchivo = 'video';
                  message.Mensaje = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                  break;
                case 'jpg':
                case 'jpeg':
                case 'png':
                  message.tipoarchivo = 'image/jpeg';
                  message.Mensaje = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                  break;
                default:
                  message.TipoArchivo = 'otro';
                  
              message.Mensaje = 'https://docs.google.com/gview?embedded=true&url=' + message.Mensaje
                  break;
              }
          
              
              
            }
          }
            
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




  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    

    let cantidadArchivos =  event.target.files.length
var empieza = 0
while (empieza >= 0 && empieza < cantidadArchivos )
  {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(empieza);

      if (file) {
        this.currentFile = file;

         this.authService.upload(this.currentFile,"Chat",this.numero).subscribe({
          next: data => { 
  
         console.log(data)
  
         this.userService.showSuccess(data.message,'Registro de datos','success')
         
          },
          error: err => {
            this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
          }
        })
      }
      
    }
    else
    {

    }
    empieza++
  }
  }

  agregarEmoji(event: any) {
    this.texto += event.emoji.native;
  }
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.mostrarSelector) {
      this.mostrarSelector = false;
    }
  }
}






