import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
 import { ListasAsociadosComponent } from './listas-asociados/listas-asociados.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { 	IgxButtonModule,	IgxCheckboxModule,	IgxDatePickerModule,	IgxDialogModule,
	IgxGridModule,	IgxInputGroupModule,	IgxIconModule,	IgxComboModule,	IgxToastModule,
	IgxRippleModule } from "igniteui-angular";
  import {MatIconModule} from '@angular/material/icon';
  import {MatToolbarModule} from '@angular/material/toolbar';
  import {MatButtonModule} from '@angular/material/button';
  import {MatMenuModule} from '@angular/material/menu';
  import {MatTableModule} from '@angular/material/table';
  import {MatPaginatorModule} from '@angular/material/paginator';
  import { MatFormFieldModule } from "@angular/material/form-field";
  import { MatSortModule } from '@angular/material/sort';
  import {MatInputModule} from '@angular/material/input';
import { DialogoarticuloComponent } from './dialogoarticulo/dialogoarticulo.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';


import { CommonModule } from "@angular/common";


import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';


import { ButtonsModule } from "@progress/kendo-angular-buttons";

import { ToastrModule } from 'ngx-toastr';
import { InputsModule } from "@progress/kendo-angular-inputs";
import {MatRippleModule} from '@angular/material/core';

import {MatBadgeModule} from '@angular/material/badge';

import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatChipsModule} from '@angular/material/chips';
import { InformesComponent } from './informes/informes.component';
import { GestionSolicitudesComponent } from './gestion-solicitudes/gestion-solicitudes.component';

// import { SocketIoModule } from 'ngx-socket-io';
// import { CookieService } from 'ngx-cookie-service';
import { ChatService } from './web-socket.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ActivarModulosComponent } from './activar-modulos/activar-modulos.component';
import { DialogoActivarmoduloComponent } from './dialogo-activarmodulo/dialogo-activarmodulo.component';
import { ArchivosComercioComponent } from './archivos-comercio/archivos-comercio.component';
import { HeadersComponent } from './headers/headers.component';
import { InfoComercioComponent } from './info-comercio/info-comercio.component';
import { DoughnutComponent } from './doughnut/doughnut.component';
const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };
import {LectorQRComponent } from './lector-qr/lector-qr.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { RecaptchaModule } from "ng-recaptcha";
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
     ListasAsociadosComponent,
    DialogoarticuloComponent,
    InformesComponent,
    GestionSolicitudesComponent,
    ActivarModulosComponent,
    DialogoActivarmoduloComponent,
    ArchivosComercioComponent,
    HeadersComponent,
    InfoComercioComponent,
    DoughnutComponent,
    LectorQRComponent   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IgxButtonModule,
	IgxCheckboxModule,
	IgxDatePickerModule,
	IgxDialogModule,
	IgxGridModule,
	IgxInputGroupModule,
	IgxIconModule,
	IgxComboModule,
	IgxToastModule,
	IgxRippleModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatMenuModule,
  MatTableModule,
  MatPaginatorModule,
  MatFormFieldModule,
  MatSortModule,
  MatInputModule,
  MatDialogModule,
  ReactiveFormsModule,
  MatSelectModule,
  MatCardModule,
  MatDividerModule,
  MatListModule,
  CommonModule,
  ToastrModule.forRoot({
    timeOut: 10000, // 15 seconds
    closeButton: false,
    progressBar: true,
  }),
  DateInputsModule,
  GridModule,
  DropDownsModule,ButtonsModule,InputsModule,
  MatListModule, FormsModule, ReactiveFormsModule,
  MatRippleModule,
  MatBadgeModule,
  ScrollingModule,
  MatChipsModule,  
  ZXingScannerModule,
  RecaptchaModule
 
  

  
  
  ],
  providers: [ authInterceptorProviders,ChatService,HeadersComponent],

  bootstrap: [AppComponent],
  
})

export class AppModule {
}
