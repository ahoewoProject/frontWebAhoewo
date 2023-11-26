import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencesImmobilieresComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/agences-immobilieres.component';
import { BiensImmobiliersComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-immobiliers.component';
import { DashboardComponent } from 'src/app/components/templates-admin/dashboard/dashboard.component';
import { DelegationsGestionsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegations-gestions.component';
import { ProfilComponent } from 'src/app/components/templates-admin/gestionDesComptes/profil/profil.component';
import { TemplatesAdminComponent } from 'src/app/components/templates-admin/templates-admin.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: '', component: TemplatesAdminComponent, canActivate: [AuthGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres', component: AgencesImmobilieresComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens-immobiliers', component: BiensImmobiliersComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/delegations-gestions', component: DelegationsGestionsComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentImmobilierRoutingModule { }
