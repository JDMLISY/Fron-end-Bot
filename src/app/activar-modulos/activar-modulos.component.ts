import { Component, OnInit,Inject,ViewChild,AfterViewInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import {FormControl, FormGroupDirective, NgForm, Validators,FormGroup,FormBuilder} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { UserService } from '../_services/user.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { DialogoActivarmoduloComponent } from '../dialogo-activarmodulo/dialogo-activarmodulo.component'
import { TokenStorageService } from '../_services/token-storage.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';






export class MyErrorStateMatcher implements ErrorStateMatcher  {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
export interface DialogData {
  Usuario: string;
  Nombre: string;
  Celular: string;
}

@Component({
  selector: 'app-activar-modulos',
  templateUrl: './activar-modulos.component.html',
  styleUrls: ['./activar-modulos.component.css']
})
export class ActivarModulosComponent {
  
  
      errorMessage = '';

      displayedColumns: string[] = ['idRegistro', 'Entidad', 'Modulo','Estado','Fecha_Creacion','ultima_Fecha_estado','Editar'];
      dataSource = new MatTableDataSource()
      
      @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
      @ViewChild(MatSort, {static: true}) sort!: MatSort;
      
      // @ViewChild(MatPaginator) paginator: MatPaginator;
      // @ViewChild(MatSort) sort: MatSort;
    
      constructor(private userService: UserService,  private authService: AuthService, private tokenStorage: TokenStorageService,public dialog: MatDialog ) {
        // Create 100 users
       
        
          this.authService.ConsultarModulos().subscribe({
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
        const dialogRef = this.dialog.open(DialogoActivarmoduloComponent, {
          height: '300px',
          width: '700px',
          data: {idRegistro: 0},
        });
    
    
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
      //    this.animal = result;
        });
      }
      
      editar(Codigo:string) {
        
        
        const dialogRef = this.dialog.open(DialogoActivarmoduloComponent, {
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
