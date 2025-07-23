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
import { formatDate } from '@angular/common';
import { TrasladoConversacionesComponent } from '../traslado-conversaciones/traslado-conversaciones.component';
import { MatSnackBar } from '@angular/material/snack-bar';





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
  ultimaFechaInsertada: string = '';
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



  listaasociados = true
  verconversacion = false
  Solicitudes =false 
  DatosUsuario: string[] = [];
  windowScrolled = false;
  imagePreview : any 
  selectedFiles?: FileList;
  currentFile?: File;
  inputMensaje: string = '';
  frasesPredefinidas: string[] = [];
  NitsPredefinidas: { strNombreIntegrado: string, Celular: string,SoloNombres: string }[] = [];
  
  desactivarBoton: boolean = true;

  // frasesPredefinidas: string[] = [
  //   "¡Hola! ¡Espero que te encuentres muy bien! ☀️",
  //   "¿Cómo podemos ayudarte el día de hoy?",
  //   "¿Cuéntanos qué dudas tienes de las deducciones de tu nómina del concepto de HOGAR FEG?",
  //   "Es con mucho gusto, ¡Estamos para servirte siempre! ❤"
  // ];
  
  busquedaFrase: string = '';
  mostrarParpadeo = false;
  busquedaNit: string = '';

  
  frasesFiltradas(): string[] {
    if (!this.busquedaFrase) return this.frasesPredefinidas;
    const filtro = this.busquedaFrase.toLowerCase();
    return this.frasesPredefinidas.filter(f => f.toLowerCase().includes(filtro));
  }
  
  onDragStart(event: DragEvent, texto: string) {
    event.dataTransfer?.setData("text/plain", texto);
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    const texto = event.dataTransfer?.getData("text/plain") || "";
    this.inputMensaje += texto;
  }
  
  




  ngAfterViewInit() {

  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargarSolicitudes();
  }

  
  

  ngOnInit() {
    this.chatService.getNewMessage().subscribe((message: any) => {
      // Si no trae fecha, se usa la fecha actual
      const fechaMensaje = new Date(message.fecha) //: new Date();
      const fechaFormateada = this.obtenerFechaFormateada(fechaMensaje);
  
      // Insertar separador si cambia la fecha
      if (fechaFormateada !== this.ultimaFechaInsertada) {
        this.Conversa.push({ tipo: 'separador', fecha: fechaFormateada });
        this.ultimaFechaInsertada = fechaFormateada;
      }
  
      // Agregar el mensaje normalmente
      this.Conversa.push(message);
  
      this.cdRef.detectChanges();
      this.scrollToBottom();
    });

    this.cargarFrasesPredefinidas();
    this.cargarnitsPredefinidas()
  }
  



  cargarFrasesPredefinidas(): void {
    const payload = {
      accion: 'listar',      
    };
  
    this.authService.RequestDataobject(payload, 'ayudasrapidas', '').subscribe({
      next: (data: any[]) => {
        this.frasesPredefinidas = data.map(item => item.Contenido);
      },
      error: err => {
        console.error('Error cargando frases:', err);
        this.frasesPredefinidas = []; // opcional
      }
    });
  }

  // Función auxiliar para formatear fechas
  obtenerFechaFormateada(fecha: Date): string {
    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);
  
    const fechaSinHora = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
    const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const ayerSinHora = new Date(ayer.getFullYear(), ayer.getMonth(), ayer.getDate());
  
    if (fechaSinHora.getTime() === hoySinHora.getTime()) {
      return 'Hoy';
    } else if (fechaSinHora.getTime() === ayerSinHora.getTime()) {
      return 'Ayer';
    } else {
      return fecha.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
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
  Radicado= ""
  texto = ""
  numero = ""
  Cedula = ""
  timerId1 = ""
  objDiv=""
  hoveredTipo: string | null = null;
  Tipoatencion = ""

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
 
  constructor( private snackBar: MatSnackBar ,private http: HttpClient,private sanitizer: DomSanitizer,private chatService: ChatService, private authService: AuthService, private cdRef: ChangeDetectorRef,   private userService: UserService, private tokenStorage: TokenStorageService, public dialog: MatDialog) {

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
  


          this.userService.Solicitudes("Solicitudes", user.tipo_atencion, "ConAso", "", "", "").subscribe({
            next: (asociados: any[]) => {
              // Combinas contactos en typesOfShoes
              this.typesOfShoes = this.typesOfShoes.map(tipo => {
                const contactosFiltrados = asociados
                  .filter(a => a.Tipo_atencion === tipo.tipo_atencion)
                  .map(c => {
                    // 🔴 Guarda el número en sessionStorage (último en la lista)
                 
          
                    return {
                      contacto: c.contacto,
                      numero: c.Numero_asociado,
                      identificacion: c.identificacion,
                      cantidad: c.Cantidad,
                      Tipo_atencion: c.Tipo_atencion
                    };
                  });
          
                return {
                  ...tipo,
                  contactos: contactosFiltrados
                };
              });
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
  this.listaasociados = false
  this.verconversacion = false
  this.Solicitudes = true
  this.contacto = Nombre
  this.Cedula = Cedula
  this.Tipoatencion = Tipo_atencion
  this.userService.Solicitudes("Solicitudes", user.tipo_atencion,"Todas",numero,Cedula,Tipo_atencion).subscribe({
    next: data => {
      if (data.length > 0) {
        this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.Radicado = data[0].Radicado

            if (sessionStorage.getItem('numeroContacto')) {
              sessionStorage.removeItem('numeroContacto');
            }
             // Luego lo guardas
            
            sessionStorage.setItem('numeroContacto',numero);
                
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


  ver_conversacion(Nombre: string,numero:string, dedonde: string,Radicado: string) {
    this.verconversacion = true
    this.listaasociados = false
    this.Solicitudes = false
    this.contacto = Nombre
    this.numero = numero   
    this.Radicado = Radicado 
  const user = this.tokenStorage.getUser();
  

    this.userService.conversaciones("Conversaciones", numero).subscribe({
      next: data => {
        if (data.length > 0) {
          const resultado: any[] = [];
          
    
          for (let message of data) {
            // Procesamiento de archivo
            if (message.Ruta_Archivo === 'S') {
              const url = message.Mensaje;
              const extension = url.split('.').pop()?.toLowerCase().replaceAll(" ", "");
    
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
                  message.Mensaje = 'https://docs.google.com/gview?embedded=true&url=' + url;
                  break;
              }
            }
    
            // Separación por fecha
            let fechaMensaje = message.fecha ? new Date(message.fecha) : new Date();
            
            if (isNaN(fechaMensaje.getTime())) {
              fechaMensaje = new Date();
            }
           
            const fechaFormateada = this.obtenerFechaFormateada(fechaMensaje);
            if (fechaFormateada !== this.ultimaFechaInsertada) {
              resultado.push({ tipo: 'separador', fecha: fechaFormateada });
              this.ultimaFechaInsertada = fechaFormateada;
            }
    
            resultado.push(message);
          }
    
          this.Conversa = resultado;
          this.cdRef.detectChanges();
          this.scrollToBottom();
          return;
        } else {
          if (data.Codigo == "401") {
            this.userService.showSuccess(data.Mensaje, "Error de comunicación", 'Error');
            setTimeout(() => this.tokenStorage.signOut(), 20);
            return;
          }
    
          this.userService.showSuccess("Error al consultar los datos, Comuníquese con el Administrador del sistema...", "Error de comunicación", 'Error');
        }
      },
      error: err => {
        this.userService.showSuccess("Error al consultar los datos, Comuníquese con el Administrador del sistema...", "Error de comunicación", 'Error');
      }
    });





  }

  async enviar(numero: string,frase: string){

    
    //var obj2 = {Mensaje: this.texto};

   // this.Conversa.push(obj2); 
   //this.Conversa = [...this.Conversa, {"Mensaje": this.texto,"dedonde": "WEB"}];
    
   this.cdRef.detectChanges();
   this.scrollToBottom(); 

     var mensaje = this.texto && this.texto.trim() !== "" ? this.texto : frase;

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
        
         
     if (data[0].HorasTranscurridas >= 24)
      {
        
        this.userService.showSuccess(data[0].Mensaje, "Mensaje informativo", 'warning')
        this.desactivarBoton = false;
        this.mostrarParpadeo = true;

      }
         
          return
        } else {          
          if (data.Codigo == "401") {
            this.desactivarBoton = true;
            this.userService.showSuccess(data.Mensaje, "Error de comunicaciòn", 'Error')
            setTimeout(() => this.tokenStorage.signOut(), 20);

            return
          }

    //      this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')

        }
      },
      error: err => {
   //     this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
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


  consultarusers(){
    this.authService.ConsultarUsers().subscribe({
      next: data => {
        
        if (data.length > 0)
        {

                 const dialogRef = this.dialog.open(TrasladoConversacionesComponent, {
            width: '750px',
            height: '700px',
            data: {
              usuarios: data,
              contacto: this.contacto,
              numero: this.numero,
              Radicado: this.Radicado
            }
          });
        
          dialogRef.afterClosed().subscribe(result => {
            this.cargarSolicitudes();
          });
          return
          
        }else 
        {
          if (data.Codigo== "401")
          {
            
            this.userService.showSuccess(data.Mensaje,"Error de comunicaciòn",'Error')
            setTimeout(() => this.tokenStorage.signOut(), 20);
               return    
          }
  
          this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...","Error de comunicaciòn",'Error')  
          //this.errorMessage = data.message;
        }
      },
      error: err => {
        this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...","Error de comunicaciòn",'Error')  
       // this.errorMessage = err.error.message;
        
      }
    })
  
  }


  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.mostrarSelector) {
      this.mostrarSelector = false;
    }
  }
  cerrarconversacion() {
    // Aquí colocas la lógica para cerrar la conversación
    this.authService.RequestData("",'Cerrarconversacion',this.numero).subscribe({
      next: data => {
   
        this.userService.showSuccess(data.message,"Cerrar conversación",'success')

      },
      error: err => {
        this.errorMessage = err.message;        
        this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...","Error de comunicaciòn",'Error')  
      }
    });
  }

  abrirConversacion (){
    
    this.desactivarBoton = true;
    this.mostrarParpadeo = false

    this.userService.Mensajeswhatplantilla(this.numero,this.contacto).subscribe({
      next: data => {        
        if (data.length > 0) {
          this.desactivarBoton = true;
          this.mostrarParpadeo = false
          return
        } else {
          if (data.Codigo == "401") {
            this.desactivarBoton = true;
                this.mostrarParpadeo = false

            this.userService.showSuccess(data.Mensaje, "Error de comunicaciòn", 'Error')
            setTimeout(() => this.tokenStorage.signOut(), 20);
            return
          }


        }
      },
      error: err => {
   
      }
    })





  }
  
  

  cargarnitsPredefinidas(): void {
    this.authService.RequestData('', 'nits', '').subscribe({
      next: (data: any[]) => {
        console.log('✅ Nits recibidos:', data);
        this.NitsPredefinidas = data[0];
      },
      error: err => {
        console.error('❌ Error cargando NITs:', err);
        this.NitsPredefinidas = [];
      }
    });
  }
  
  NitsFiltrados(): { strNombreIntegrado: string, Celular: string, SoloNombres:string }[] {
    if (!this.busquedaNit) return this.NitsPredefinidas;
  
    const filtro = this.busquedaNit.toLowerCase();
    return this.NitsPredefinidas.filter(nit =>
      nit.strNombreIntegrado?.toLowerCase().includes(filtro) ||
      nit.Celular?.toLowerCase().includes(filtro)
      

    );
  }
  
  buscarContacto(): void{
    
    this.listaasociados = true
    this.verconversacion = false
    this.Solicitudes =false
  
  }
}






