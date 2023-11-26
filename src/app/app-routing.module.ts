import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { TemplatesClientComponent } from './components/templates-client/templates-client.component';

const routes: Routes = [
  { path: '', redirectTo:'', pathMatch: 'full'},
  { path: 'connexion', component: LoginComponent },
  {
    path: 'inscription',
    component: RegisterComponent,
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', component: TemplatesClientComponent },
  { path: 'admin', loadChildren: () => import('./routes/admin/admin.module').then(m => m.AdminModule) },
  { path: 'notaire', loadChildren: () => import('./routes/notaire/notaire.module').then(m => m.NotaireModule) },
  { path: 'responsable', loadChildren: () => import('./routes/responsable/responsable.module').then(m => m.ResponsableModule) },
  { path: 'agent-immobilier', loadChildren: () => import('./routes/agent-immobilier/agent-immobilier.module').then(m => m.AgentImmobilierModule) },
  { path: 'proprietaire', loadChildren: () => import('./routes/proprietaire/proprietaire.module').then(m => m.ProprietaireModule) },
  { path: 'gerant', loadChildren: () => import('./routes/gerant/gerant.module').then(m => m.GerantModule) },
  { path: 'demarcheur', loadChildren: () => import('./routes/demarcheur/demarcheur.module').then(m => m.DemarcheurModule) },
  { path: 'client', loadChildren: () => import('./routes/client/client.module').then(m => m.ClientModule) },
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
