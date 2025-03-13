import { Component, OnInit } from '@angular/core';

import {HttpHeaders} from "@angular/common/http";
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {

  constructor( private authService: AuthService,private userService: UserService, public dialog: MatDialog,) { }

  ngOnInit(): void {
  }


  traer_archivo(parametro :string) {
    this.authService.downloadFile(parametro,"N").subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'file.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
    
      

}
}
