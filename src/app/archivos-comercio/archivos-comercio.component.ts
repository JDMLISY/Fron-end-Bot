import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { HeadersComponent } from '../headers/headers.component';


export interface User {
  id?: number;
  username?: string;
  email?: string;
  photoUrl?: string;
}
@Component({
  selector: 'app-archivos-comercio',
  templateUrl: './archivos-comercio.component.html',
  styleUrls: ['./archivos-comercio.component.css']
})
export class ArchivosComercioComponent implements OnInit {
  
  photoFile: File | undefined;
  photoPreview: string | undefined;
  user: User | undefined;  

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  constructor(private httpClient: HttpClient, private authService:AuthService,private userService: UserService,public headersComponent: HeadersComponent ) {}

  ngOnInit(): void {
    // this.httpClient.get<User>('http://localhost:3000/user/account')
    // .subscribe(user => this.user = user);
  }

  onFileChange(event: any): void {
    this.selectedFiles = event.target.files;
  }



   save()  {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

         this.authService.upload(this.currentFile,"Archivo",'').subscribe({
          next: data => { 
  
         console.log(data)
  
         this.userService.showSuccess(data.message,'Registro de datos','success')
         
          },
          error: err => {
            this.userService.showSuccess("Error al consultar los datos, Comuniquese con el Administrador del sistema...", "Error de comunicaciòn", 'Error')
          }
        })
      }

      this.selectedFiles = undefined;
    }
    else
    {

    }


  }


}
