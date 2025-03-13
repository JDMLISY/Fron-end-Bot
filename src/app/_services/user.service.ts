import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from '../_services/token-storage.service';

const AUTH_API = environment.AUTH_API;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json',
    
   })
};
//const API_URL = 'https://soari.co:50000/api/';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient,private toastr: ToastrService, private tokenStorage: TokenStorageService) { }

  getPublicContent(): Observable<any> {
    return this.http.get(AUTH_API + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(AUTH_API + 'user', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(AUTH_API + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(AUTH_API + 'admin', { responseType: 'text' });
  }

  Solicitudes(NombreMetodo:string,data: string,tipoconsulta: string,numero:string,cedula: string ): Observable<any> {
    return this.http.post(AUTH_API + NombreMetodo, {data,
      Nit: this.tokenStorage.getUser().Nit, 
      tipoconsulta: tipoconsulta  ,
      numero:numero,
      cedula  
      // Nombre,
      
    }, httpOptions);
    
  }

  conversaciones(NombreMetodo:string,data: string, numero:string): Observable<any> {
    return this.http.post(AUTH_API + NombreMetodo, {data,
      Nit: this.tokenStorage.getUser().Nit,
      numero: numero
      // Nombre,
      
    }, httpOptions);
    
  }



  Mensajeswhat(NombreMetodo:string,typomensaje: string,mensaje: string, numero:string): Observable<any> {
     
    return this.http.post(AUTH_API + NombreMetodo, {
      Nit: this.tokenStorage.getUser().Nit,
      numero: numero,
      mensaje: mensaje,
      typomensaje:typomensaje
      // Nombre,
      
    }, httpOptions);
    
  }
  

 
  showSuccess(mensaje : string,titulo:string,tipo: string) {
    if (tipo == "Error"){
    this.toastr.error(mensaje, titulo);
    }
    if (tipo == "success"){
      this.toastr.success(mensaje, titulo);
      }
      if (tipo == "info"){
        this.toastr.info(mensaje, titulo);
        }
        if (tipo == "warning"){
          this.toastr.warning(mensaje, titulo);
          }
  }
}