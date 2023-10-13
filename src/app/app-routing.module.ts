import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { TemplatesAdminComponent } from './components/templates-admin/templates-admin.component';
import { DashboardComponent } from './components/templates-admin/dashboard/dashboard.component';
import { RolesComponent } from './components/templates-admin/roles/roles.component';
import { AdministrateursComponent } from './components/templates-admin/administrateurs/administrateurs.component';
import { NotairesComponent } from './components/templates-admin/notaires/notaires.component';
import { ProprietairesComponent } from './components/templates-admin/proprietaires/proprietaires.component';
import { AgentsImmobiliersComponent } from './components/templates-admin/agents-immobiliers/agents-immobiliers.component';
import { DemarcheursComponent } from './components/templates-admin/demarcheurs/demarcheurs.component';
import { GerantsComponent } from './components/templates-admin/gerants/gerants.component';
import { ClientsComponent } from './components/templates-admin/clients/clients.component';
import { ProfilComponent } from './components/templates-admin/profil/profil.component';
import { DemandesCertificationsComponent } from './components/templates-admin/demandes-certifications/demandes-certifications.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { TemplatesClientComponent } from './components/templates-client/templates-client.component';

const routes: Routes = [
  { path: '', redirectTo:'', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', component: TemplatesClientComponent },
  { path: 'admin', component: TemplatesAdminComponent,
    children:[
      { path: 'dashboard', component: DashboardComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'admins', component: AdministrateursComponent },
      { path: 'notaires', component: NotairesComponent },
      { path: 'proprietaires', component: ProprietairesComponent },
      { path: 'agents-immobiliers', component: AgentsImmobiliersComponent },
      { path: 'demarcheurs', component: DemarcheursComponent },
      { path: 'gerants', component: GerantsComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'profil', component: ProfilComponent },
      { path: 'demandes-certifications', component: DemandesCertificationsComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
