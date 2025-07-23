
import { DialogEntidadComponent } from '../dialog-entidad/dialog-entidad.component';
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


@Component({
  selector: 'app-matricula-entidades',
  templateUrl: './matricula-entidades.component.html',
  styleUrls: ['./matricula-entidades.component.css'] // o .css según tu archivo
})

export class MatriculaEntidadesComponent {
  entidades: any[] = []; // Aquí guardarás lo que traes del backend

  displayedColumns: string[] = [
    'idEntidad',
    'Nitentidades',
    'NombreEntidad',
    'AliasBD',
    'FechaMatricula',
    'nombrebd',
    'Origendatos',
    'Editar'
  ];
  
  dataSource = new MatTableDataSource()
  errorMessage = '';
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;


  constructor(private dialog: MatDialog,  private authService: AuthService, private userService: UserService,private tokenStorage: TokenStorageService) {
    const body = {
      accion: 'listar', // Aquí defines la acción que quieras (crear, editar, eliminar, listar)
      newData: ""
    };

  this.authService.RequestDataobject(body, 'entidades', '').subscribe({
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
  
  }

  abrirModal(entidad?: any) {
    const dialogRef = this.dialog.open(DialogEntidadComponent, {
      width: '700px',
      data: {
        accion: 'crear',
        entidad: entidad || {}
      }
    });
  
  

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarEntidad(result);
      }
    });
  }

  guardarEntidad(entidad: any) {
    // Aquí haces POST o PUT al backend
    console.log('Entidad recibida:', entidad);
    // Luego refrescas la lista si es necesario
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
  editar(Codigo:string) {
    
    
    const dialogRef = this.dialog.open(DialogEntidadComponent, {
      height: '600px',
      width: '750px',
      data: {
        Codigo: Codigo,
        accion: 'editar'
      }
    });



    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
  //    this.animal = result;
    });
  } 
 
  



}

