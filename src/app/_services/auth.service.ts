import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { estadoradicadosComponent } from '../estado-radicados/estado-radicados.component';
import { MatriculaAyudasComponent } from '../matricula-ayudas/matricula-ayudas.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MensajeswhatsappplantillaComponent } from '../mensajeswhatsappplantilla/mensajeswhatsappplantilla.component';
import { ParametrosplantillasComponent } from '../parametrosplantillas/parametrosplantillas.component';
import { ModelosiaComponent } from '../modelosia/modelosia.component';


const AUTH_API = environment.AUTH_API;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public data1: any[""]

  constructor(private userService: UserService, public dialog: MatDialog ,private http: HttpClient, private tokenStorage: TokenStorageService, private router: Router) {

  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': this.tokenStorage.getUser().accessToken,
      'enctype': 'multipart/form-data'
    })
  }


  login(encryptedPayload: string): Observable<any> {
    return this.http.post(AUTH_API + 'Login', { payload: encryptedPayload });
  }
  
 

  RequestData(newData: string, NombreMetodo: string, numero: string): Observable<any> {
    
    return this.http.post(AUTH_API + NombreMetodo, {
      newData,
      Nit: this.tokenStorage.getUser().Nit,
      numero: numero,
      Nombreasesor: this.tokenStorage.getUser().name,

    }, httpOptions);
  }

  RequestDataobject(newData: any, NombreMetodo: string, numero: string): Observable<any> {

    return this.http.post(AUTH_API + NombreMetodo, {
      newData,
      Nit: this.tokenStorage.getUser().Nit,
      numero: numero,
      Nombreasesor: this.tokenStorage.getUser().name,

    }, httpOptions);
  }


  RequestDataobjectcampañas(
    newData: any,
    NombreMetodo: string,
    numero: string,
    campania: any,
    archivo?: File
): Observable<any> {

    const formData = new FormData();

    // Datos generales
    formData.append("Nit", this.tokenStorage.getUser().Nit);
    formData.append("numero", numero);
    formData.append("Nombreasesor", this.tokenStorage.getUser().name);

    // Objetos convertidos a texto
    formData.append("newData", JSON.stringify(newData));
    formData.append("campania", JSON.stringify(campania));

    // Archivo (solo si existe)
    if (archivo) {
        formData.append("archivo", archivo, archivo.name);
    }

    return this.http.post(
        AUTH_API + NombreMetodo,
        formData
    );

}


  
  ConsultarUsers(): Observable<any> {

    return this.http.post(AUTH_API + 'ConsultarUsers', {
      Nit: this.tokenStorage.getUser().Nit
    }, httpOptions);
  }

  ConsultarModulos(): Observable<any> {

    return this.http.post(AUTH_API + 'ConsultarModulos', {
      Nit: this.tokenStorage.getUser().Nit,
      tipoconsulta: "T",
      Modulo: ""
    }, httpOptions);
  }

  ValidarModulo(opcion: string, modulo: string): void {


    this.http.post(AUTH_API + 'ConsultarModulos', {
      Nit: this.tokenStorage.getUser().Nit,
      tipoconsulta: "U",
      Modulo: modulo
    }, httpOptions).subscribe({
      next: data => {

        this.data1 = data

        if (this.data1.length > 0) {
          if(opcion=="Radicados" || opcion=="ayudas" || opcion=="envioplantilla" || opcion=="ParametrosPlantillas" || opcion=="modelosia"  )
            {
              
              this.openDialog(opcion)
                  return
          }




          this.router.navigate([opcion])
        } else {
          if (this.data1.Codigo == '401') {

            this.conexiontoken(this.data1.Mensaje)

          } else {

            this.userService.showSuccess("Módulo Desactivado, por favor comuníquese con su proveedor de sistema para activarlo...", 'Inactividad de Módulo', 'info')
          }

          this.router.navigate(['/login'])
        }



      },
      error: err => {
        this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
      }
    })



  }

  openDialog(opcion: string): void {
    if(opcion=="Radicados")
      {
    const dialogRef = this.dialog.open(estadoradicadosComponent, {
      height: '800px',
      width: '950px',
      data:  "",
    });
    }
    if(opcion=="ayudas")
      {
        const dialogRef = this.dialog.open(MatriculaAyudasComponent, {
          height: '800px',
          width: '950px',
          data:  "",
        });

      }
      if(opcion=="envioplantilla")
        {


          const dialogRef = this.dialog.open(MensajeswhatsappplantillaComponent, {
            width: '1000px',
            height: '90vh',
            maxWidth: '95vw',
            data:  "",
          });
  
        }

        if(opcion=="ParametrosPlantillas")
          {
        
  
            const dialogRef = this.dialog.open(ParametrosplantillasComponent, {
              width: '600px',
              height: '70vh',
              maxWidth: '95vw',
              data:  "",
            });
    
          }

          if(opcion=="modelosia")
            {
          
    
              const dialogRef = this.dialog.open(ModelosiaComponent, {
                width: '900px',
                height: '70vh',
                maxWidth: '95vw',
                data:  "",
              });
      
            }


    }
    downloadFile(
      parametro: string,
      numero: string,
      fechaDesde: string = '',
      fechaHasta: string = ''
    ): Observable<Blob> {
    
      let params = new HttpParams();
    
      params = params.append('Nit', this.tokenStorage.getUser().Nit);
      params = params.append('tipoarchivo', parametro);
      params = params.append('numero', numero);
      params = params.append('fechaDesde', fechaDesde);
      params = params.append('fechaHasta', fechaHasta);
    
      return this.http.get(AUTH_API + 'download', {
        params: params,
        responseType: 'blob'
      });
    
    }
  // downloadFile(parametro: string, numero: string): Observable<Blob> {

  //   //Parameter passing failure;

  //   let params = new HttpParams();

  //   params = params.append('Nit', this.tokenStorage.getUser().Nit);
  //   params = params.append('tipoarchivo', parametro);
  //   params = params.append('numero', numero);

  //   const requestOptions = { params: params };

  //   return this.http.get(AUTH_API + 'download', { params: params, responseType: 'blob' });
  // }




  upload(file: File, dedonde: string, numero: string): Observable<any> {
    const formData: FormData = new FormData();
    var nit = this.tokenStorage.getUser().Nit
    formData.append('file', file);
    formData.append("Nit", nit);
    formData.append("numero", numero);
    if (dedonde == "Chat") {
      return this.http.post(`${AUTH_API}/uploadChat`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
    } else {
      return this.http.post(`${AUTH_API}/upload`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
    }




  }

  conexiontoken(Mensaje: string): void {
    this.userService.showSuccess(Mensaje, 'Tiempo de sesion', 'Error')
    this.tokenStorage.signOut();
    //window.location.reload();
    this.router.navigate(['/login'])

  }
}