// import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import {AfterViewInit, Component, ViewChild,OnInit,Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { TokenStorageService } from '../_services/token-storage.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogoarticuloComponent } from '../dialogoarticulo/dialogoarticulo.component'
import { UserService } from '../_services/user.service';




/** Constants used to fill up our data base. */



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],  

 
})
export class RegisterComponent  {
  //ngOnInit(): void {}
  
 
  displayedColumns: string[] = ['idRegistro', 'Nombre', 'Usuario','Estado','Editar'];
  dataSource = new MatTableDataSource()
  errorMessage = '';
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;


 



  constructor(private userService: UserService,  private authService: AuthService, private tokenStorage: TokenStorageService,public dialog: MatDialog ) {
    // Create 100 users
   
    
      this.authService.ConsultarUsers().subscribe({
        next: data => {
          
          if (data.length > 0)
          {
  
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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
          this.errorMessage = err.error.message;
          
        }
      })
    

  //  const users = Array.from({length:0}, (_, k) => createNewUser(k + 0));
  //   debugger
  //  this.dataSource = new MatTableDataSource(users);
   

    // Assign the data to the data source for the table to render
    
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogoarticuloComponent, {
      height: '500px',
      width: '750px',
      data: {idRegistro: 0},
    });



    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
  //    this.animal = result;
    });
  }
  
  editar(Codigo:string) {
    
    
    const dialogRef = this.dialog.open(DialogoarticuloComponent, {
      height: '500px',
      width: '750px',
      data:  Codigo,
    });



    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
  //    this.animal = result;
    });
  } 
 

  ngAfterViewInit() {
    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}






