import { Component, OnInit } from '@angular/core';

import {HttpHeaders} from "@angular/common/http";
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {
  isLoggedIn = false;
  constructor( private authService: AuthService,private userService: UserService, public dialog: MatDialog,private tokenStorageService: TokenStorageService) { }
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  limpiarFechas(){

    this.fechaDesde = null;
    this.fechaHasta = null;

}
  ngOnInit(): void {
  }


//   traer_archivo(parametro :string) {

  
   
  

//       const user = this.tokenStorageService.getUser();
//       if (user.Nit == '800052851')
//       {
// if (user.roles == 'A' || user.roles == 'S' )
// {


//     this.authService.downloadFile(parametro,"N").subscribe((blob) => {
//       const a = document.createElement('a');
//       const objectUrl = URL.createObjectURL(blob);
//       a.href = objectUrl;
//       a.download = 'file.xlsx';
//       a.click();
//       URL.revokeObjectURL(objectUrl);
//     });
//   }else{
//     this.userService.showSuccess("No tienes acceso a estos informes consulta con tu Administrador", "Informativo", "warning");
//   }


//   } else {


//     this.authService.downloadFile(parametro,"N").subscribe((blob) => {
//       const a = document.createElement('a');
//       const objectUrl = URL.createObjectURL(blob);
//       a.href = objectUrl;
//       a.download = 'file.xlsx';
//       a.click();
//       URL.revokeObjectURL(objectUrl);
//     });


//   }

// }

traer_archivo(parametro: string) {

  const fechaDesde = this.formatearFecha(this.fechaDesde);
  const fechaHasta = this.formatearFecha(this.fechaHasta);

  const user = this.tokenStorageService.getUser();

  if (user.Nit == '800052851') {

    if (user.roles == 'A' || user.roles == 'S') {

      this.authService.downloadFile(
        parametro,
        "N",
        fechaDesde,
        fechaHasta
      ).subscribe((blob) => {

        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);

        a.href = objectUrl;
        a.download = 'file.xlsx';
        a.click();

        URL.revokeObjectURL(objectUrl);

      });

    } else {

      this.userService.showSuccess(
        "No tienes acceso a estos informes consulta con tu Administrador",
        "Informativo",
        "warning"
      );

    }

  } else {

    this.authService.downloadFile(
      parametro,
      "N",
      fechaDesde,
      fechaHasta
    ).subscribe((blob) => {

      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);

      a.href = objectUrl;
      a.download = parametro + '.xlsx';
      a.click();

      URL.revokeObjectURL(objectUrl);

    });

  }

}



formatearFecha(fecha: Date | null): string {
  if (!fecha) {
    return '';
  }

  const año = fecha.getFullYear();
  const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
  const dia = ('0' + fecha.getDate()).slice(-2);

  return `${año}-${mes}-${dia}`;
}

}
