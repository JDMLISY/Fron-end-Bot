import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../_services/auth.service';
import {ErrorStateMatcher} from '@angular/material/core';
import { UserService } from '../_services/user.service';


@Component({
  selector: 'app-mensajeswhatsappplantilla',
  templateUrl: './mensajeswhatsappplantilla.component.html',
  styleUrls: ['./mensajeswhatsappplantilla.component.css']
})
export class MensajeswhatsappplantillaComponent {

  dragActive = false;
  columnas: string[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  resultadosEnvio: any[] = [];
columnasResultado: string[] = ['numero', 'estado', 'error'];
tipoCampania='texto';
enviandoCampania = false;

archivoMedia:any;

previewMedia:any;
nombreCampania = '';
  constructor(private userService: UserService,private dialogRef: MatDialogRef<MensajeswhatsappplantillaComponent>,private authService: AuthService) {}
  ngOnInit() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return Object.values(data)
        .join(' ')
        .toLowerCase()
        .includes(filter);
    };
  }

  nombreArchivo: string = '';
  titulo: string = '';
  mensaje: string = '';
  columnaTelefono: string = '';

detectarColumnaTelefono(): string {
  const posibles = ['telefono', 'tel', 'celular', 'movil', 'phone', 'whatsapp','numero'];

  const encontrada = this.columnas.find(col => {
    const nombre = col.toLowerCase().replace(/\s/g, '');
    return posibles.some(p => nombre.includes(p));
  });

  if (!encontrada) {
            this.userService.showSuccess('❌ No se encontró columna de teléfono',"Envio mensaje whatsapp",'Error')  
    // OPCIÓN 1: mostrar mensaje simple
    

    // OPCIÓN 2 (mejor): usar snackbar si tienes Angular Material
    // this.snackBar.open('No se encontró columna de teléfono', 'Cerrar', { duration: 3000 });

    return '';
  }

  this.columnaTelefono = encontrada;

  console.log('✅ Columna detectada:', encontrada);

  return encontrada;
}
  // DRAG EVENTS
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragActive = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragActive = false;

    const file = event.dataTransfer?.files[0];
    if (file) this.leerExcel(file);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.leerExcel(file);
  }
  aplicarFiltro(event: any) {
    const valor = event.target.value.trim().toLowerCase();
    this.dataSource.filter = valor;
  }
  // LEER EXCEL
  leerExcel(file: File) {
    this.nombreArchivo = file.name;
  

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'binary' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data: any[] = XLSX.utils.sheet_to_json(sheet);

      const dataConCheck = data.map(row => ({
        ...row,
        selected: true
      }));

      this.columnas = Object.keys(data[0] || {});
      this.displayedColumns = ['selected', ...this.columnas];

      this.dataSource.data = dataConCheck;
    };

    reader.readAsBinaryString(file);
  }

  // CHECKBOX
  toggleAll(event: any) {
    const checked = event.checked;
    this.dataSource.data.forEach(row => row.selected = checked);
  }

  haySeleccionados(): boolean {
    return this.dataSource.data.some(row => row.selected);
  }
  esNumeroValido(numero: any): boolean {
    if (!numero) return false;
  
    // Convertir a string y limpiar todo lo que no sea número
    const limpio = numero.toString().replace(/\D/g, '');
  
    // Validaciones
    if (limpio.length < 10) return false;   // muy corto
    if (limpio.length > 13) return false;   // muy largo
  
    // Opcional: validar Colombia (empieza con 3 o 57)
    if (limpio.length === 10 && !limpio.startsWith('3')) return false;
  
    return true;
  }
  usarSeleccionados() {

    if (!this.validarTituloMensaje()) {
      return;
    }
  


    // Detectar columna teléfono
    const columna = this.detectarColumnaTelefono();
  
    if (!columna) {
      return;
    }
  
    // Contactos seleccionados
    const seleccionados = this.dataSource.data.filter(r => r.selected);
  
    if (!seleccionados.length) {
  
      this.userService.showSuccess(
        'No has seleccionado ningún registro',
        'Envio mensaje whatsapp',
        'success'
      );
  
      return;
    }
  
    // Validar teléfonos
    const invalidos = seleccionados.filter(r =>
      !this.esNumeroValido(r[columna])
    );
  
    if (invalidos.length > 0) {
  
      const lista = invalidos
        .map(r => r[columna])
        .join('\n');
  
      this.userService.showSuccess(
        `Hay ${invalidos.length} números inválidos:\n\n${lista}`,
        'Envio mensaje whatsapp',
        'success'
      );
  
      // return;
    }
  
    // Datos que viajarán al backend
    const limpios = seleccionados.map(r => ({
  
      ...r,
  
      telefono: r[columna].toString().replace(/\D/g, ''),
  
      titulo: this.titulo,
  
      mensaje: this.mensaje,
  
      tipoCampania: this.tipoCampania
  
    }));
  
  
    const campania = {
      nombreCampania: this.nombreCampania,
      tipoCampania: this.tipoCampania,
  
      titulo: this.titulo,
  
      mensaje: this.mensaje
  
    };
  
  
    if (this.enviandoCampania) {
        return;
    }

    this.enviandoCampania = true;

    this.authService.RequestDataobjectcampañas(
  
      limpios,
  
      'enviarPlantillaenbloque',
  
      '',
  
      campania,
  
      this.archivoMedia   // <-- AQUÍ va el archivo
  
    ).subscribe({
  
      next: (resp) => {
  
        this.userService.showSuccess(
          `Datos enviados correctamente: 🚀 ${resp.enviados}`,
          'Envio mensaje whatsapp',
          'success'
        );
  
        this.userService.showSuccess(
          `Datos Con Errores: ❌ ${resp.errores}`,
          'Envio mensaje whatsapp',
          'Error'
        );
        this.enviandoCampania = false;
        this.resultadosEnvio = resp.detalle;
  
        this.limpiarPantalla();
  
      },
  
      error: (err) => {
  
        this.userService.showSuccess(
          '❌ Error: ' + err,
          'Envio mensaje whatsapp',
          'Error'
        );
  
      }
  
    });
  
  }
  
//   usarSeleccionados() {
//     if (!this.validarTituloMensaje()) {
//       return;
//     }
//     // 1. Detectar columna de teléfono
//     const columna = this.detectarColumnaTelefono();
  
//     // 2. Si no existe → detener
//     if (!columna) {
//       return;
//     }
  
//     // 3. Obtener seleccionados
//     const seleccionados = this.dataSource.data.filter(r => r.selected);
  
//     if (!seleccionados.length) {
//       this.userService.showSuccess('No has seleccionado ningún registro',"Envio mensaje whatsapp",'success')  
      
//       return;
//     }
  
//     // 4. Validar teléfonos
//     const invalidos = seleccionados.filter(r => 
//       !this.esNumeroValido(r[columna])
//     );
    
//     if (invalidos.length > 0) {
    
//       const lista = invalidos
//         .map(r => r[columna])
//         .join('\n');
       
//         this.userService.showSuccess(`Hay ${invalidos.length} números inválidos:\n\n${lista}`,"Envio mensaje whatsapp",'success')  
      
    
//   //    return;
//     }
//     // 5. Normalizar (opcional pero PRO)
//     const limpios = seleccionados.map(r => ({
//       ...r,
//       telefono: r[columna].toString().replace(/\D/g, ''),
//       titulo: this.titulo,
//       mensaje: this.mensaje
//     }));
//     this.authService.RequestDataobject(
//       limpios,               // newData
//       'enviarPlantillaenbloque',     // NombreMetodo (endpoint)
//       ''                 // numero
//     ).subscribe({
//       next: (resp) => {
        
//         this.userService.showSuccess(`Datos enviados correctamente: 🚀 ${resp.enviados}` ,"Envio mensaje whatsapp",'success')  

//         this.userService.showSuccess(`Datos Con Errores: ❌ ${resp.errores}`,"Envio mensaje whatsapp",'Error')  

      
//         this.resultadosEnvio = resp.detalle;

//       },
//       error: (err) => {
                
//         this.userService.showSuccess("❌ Error:," + err,"Envio mensaje whatsapp",'Error')          
        
//       }
//     });
//     // 6. Cerrar dialogo con datos limpios
// this.limpiarPantalla()
//   }

  cerrar() {
    this.dialogRef.close();
  }
  validarTituloMensaje(): boolean {

    // limpiar espacios
    this.titulo = (this.titulo || '').trim();
    this.mensaje = (this.mensaje || '').trim();
  
    if (!this.nombreCampania) {
              
      this.userService.showSuccess("El Nombre de la campaña es obligatorio","Envio mensaje whatsapp",'warning')  
      
      return false;
    }


    // 🔹 TÍTULO
    if (!this.titulo) {
              
      this.userService.showSuccess("El título es obligatorio","Envio mensaje whatsapp",'warning')  
      
      return false;
    }
  
    if (this.titulo.length < 3) {
      this.userService.showSuccess("El título debe tener mínimo 3 caracteres","Envio mensaje whatsapp",'warning')  
      
      return false;
    }
  
    if (this.titulo.length > 60) {
      this.userService.showSuccess("El título no puede superar 60 caracteres","Envio mensaje whatsapp",'warning')  
      
      return false;
    }
  
    // 🔹 MENSAJE
    if (!this.mensaje) {
      this.userService.showSuccess('El mensaje es obligatorio',"Envio mensaje whatsapp",'warning')  

      return false;
    }
  
    if (this.mensaje.length < 5) {
      this.userService.showSuccess('El mensaje debe tener mínimo 5 caracteres',"Envio mensaje whatsapp",'warning')        
      return false;
    }
  
    if (this.mensaje.length > 1024) {
      this.userService.showSuccess('El mensaje es demasiado largo',"Envio mensaje whatsapp",'warning')
      
      return false;
    }
  
    return true;
  }
  limpiarPantalla() {
    this.titulo = '';
    this.mensaje = '';
    this.columnas = [];
    this.displayedColumns = [];
    this.dataSource.data = [];
  }

  seleccionarMedia(event:any){

    this.archivoMedia=event.target.files[0];

}
}