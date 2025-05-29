import { Component, OnInit,ChangeDetectorRef,ViewChild,Inject,AfterViewInit,ElementRef,HostListener } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { UserService } from './_services/user.service';
import { AuthService } from './_services/auth.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { estadoradicadosComponent } from './estado-radicados/estado-radicados.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showSuperAdminBoard = false;
  showModeratorBoard = false;
  modulo = false
  username?: string;
  dataSource = new MatTableDataSource()
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild(CdkVirtualScrollViewport, {static: true}) viewport !: CdkVirtualScrollViewport;
  mostrarSelector: boolean = false;
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
   
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showSuperAdminBoard = this.roles.includes('S');
      this.showAdminBoard = this.roles.includes('A');
      this.showModeratorBoard = this.roles.includes('U');

      this.username = user.name;
     
    }
   
  }
  constructor(private tokenStorageService: TokenStorageService,public services :AuthService, private userService: UserService,public dialog: MatDialog ) { }

 

  logout(): void {
    this.tokenStorageService.signOut();
   // window.location.reload();
    
  }
    



  openDialog(): void {
    const dialogRef = this.dialog.open(estadoradicadosComponent, {
      height: '800px',
      width: '950px',
      data:  "",
    });

  }

  // ValidarModulo(): void {
    

  //   this.router.navigate(["/listAso"]);
  // }
 
}