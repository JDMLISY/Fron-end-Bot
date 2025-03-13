import { Component, OnInit,Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-info-comercio',
  templateUrl: './info-comercio.component.html',
  styleUrls: ['./info-comercio.component.css']
})
export class InfoComercioComponent implements OnInit {
  @Input() valor: string="PRUEBA";
  constructor(public _router: ActivatedRoute,private authService: AuthService,private userService: UserService, public dialog: MatDialog,) { 
    
  //  console.log(this._router.snapshot.paramMap.get('params'))
   

  }

  ngOnInit(): void {
  }


  Consultarinfo(event: any): void {
var dato = event.value
this.authService.downloadFile(dato,"N").subscribe((blob) => {
  const a = document.createElement('a');
  const objectUrl = URL.createObjectURL(blob);
  a.href = objectUrl;
  a.download = event.value + '.xlsx';
  a.click();
  URL.revokeObjectURL(objectUrl);


});
    
      

}
  



}
