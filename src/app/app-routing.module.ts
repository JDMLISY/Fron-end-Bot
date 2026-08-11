import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { MatriculaEntidadesComponent } from './matricula-entidades/matricula-entidades.component'; // Ajusta la ruta si es diferente
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { ListasAsociadosComponent } from './listas-asociados/listas-asociados.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { AppComponent } from './app.component';
import { InformesComponent } from './informes/informes.component';
import { ActivarModulosComponent } from './activar-modulos/activar-modulos.component';
import { ArchivosComercioComponent } from './archivos-comercio/archivos-comercio.component';
import { InfoComercioComponent } from './info-comercio/info-comercio.component';
import { LectorQRComponent } from './lector-qr/lector-qr.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SessionEndedComponent } from './session-ended/session-ended.component';
import { AsociadosComponent } from './asociados/asociados.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { EstadisticascampaniasComponent } from './estadisticascampanias/estadisticascampanias.component';
import { ModelosiaComponent } from './modelosia/modelosia.component';
import { PlaygroundComponent } from './playground/playground.component';
import { AgentesiaComponent } from './agentesia/agentesia.component';






const routes: Routes = [
  {path: 'matricula-entidades', component: MatriculaEntidadesComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'listAso', component: ListasAsociadosComponent },
  { path: 'mod', component: BoardModeratorComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'root', component: AppComponent },
  { path: 'Informes', component: InformesComponent },
  { path: 'estadisticascampanias', component: EstadisticascampaniasComponent },
  { path: 'activaModulo', component: ActivarModulosComponent },
  { path: 'Archivos', component: ArchivosComercioComponent },
  { path: 'Infocomercio', component: InfoComercioComponent },
  { path: 'lectorqr', component: LectorQRComponent },
  { path: 'reset/:token', component: ResetPasswordComponent },
  { path: 'session-ended', component: SessionEndedComponent },
  { path: 'PanelClientes', component: AsociadosComponent },
  { path: 'Empresa', component: EmpresaComponent },  
  { path: 'modelosia', component: ModelosiaComponent },  
  { path: 'Playground', component: PlaygroundComponent },  
  { path: 'agentesia', component: AgentesiaComponent },  
  



  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
