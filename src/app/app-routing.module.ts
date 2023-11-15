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
import { AuthGuard } from './guards/auth.guard';
import { AgencesImmobilieresComponent } from './components/templates-admin/agences-immobilieres/agences-immobilieres.component';
import { ServicesComponent } from './components/templates-admin/services/services.component';
import { TypesDeBienComponent } from './components/templates-admin/types-de-bien/types-de-bien.component';
import { BiensImmobiliersComponent } from './components/templates-admin/biens-immobiliers/biens-immobiliers.component';
import { DelegationsGestionsComponent } from './components/templates-admin/delegations-gestions/delegations-gestions.component';
import { ResponsablesAgenceImmobiliereComponent } from './components/templates-admin/responsables-agence-immobiliere/responsables-agence-immobiliere.component';

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
  { path: 'admin', component: TemplatesAdminComponent, canActivate: [AuthGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'roles', component: RolesComponent, canActivate: [AuthGuard] },
      { path: 'admins', component: AdministrateursComponent, canActivate: [AuthGuard] },
      { path: 'notaires', component: NotairesComponent, canActivate: [AuthGuard] },
      { path: 'proprietaires', component: ProprietairesComponent, canActivate: [AuthGuard] },
      { path: 'responsables-agence-immobiliere', component: ResponsablesAgenceImmobiliereComponent, canActivate: [AuthGuard] },
      { path: 'agents-immobiliers', component: AgentsImmobiliersComponent, canActivate: [AuthGuard] },
      { path: 'demarcheurs', component: DemarcheursComponent, canActivate: [AuthGuard] },
      { path: 'gerants', component: GerantsComponent, canActivate: [AuthGuard] },
      { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
      { path: 'demandes-certifications', component: DemandesCertificationsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres', component: AgencesImmobilieresComponent, canActivate: [AuthGuard] },
      { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },
      { path: 'types-de-bien', component: TypesDeBienComponent, canActivate: [AuthGuard] },
      { path: 'biens-immobiliers', component: BiensImmobiliersComponent, canActivate: [AuthGuard] },
      { path: 'delegations-gestions', component: DelegationsGestionsComponent, canActivate: [AuthGuard] }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
