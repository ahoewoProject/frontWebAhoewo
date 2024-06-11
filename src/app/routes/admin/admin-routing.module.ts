import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrateursComponent } from 'src/app/components/templates-admin/gestionDesComptes/administrateurs/administrateurs.component';
import { AgencesImmobilieresComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/agences-immobilieres.component';
import { AgentsImmobiliersComponent } from 'src/app/components/templates-admin/gestionDesComptes/agents-immobiliers/agents-immobiliers.component';
import { ClientsComponent } from 'src/app/components/templates-admin/gestionDesComptes/clients/clients.component';
import { DashboardComponent } from 'src/app/components/templates-admin/dashboard/dashboard.component';
import { DemarcheursComponent } from 'src/app/components/templates-admin/gestionDesComptes/demarcheurs/demarcheurs.component';
import { GerantsComponent } from 'src/app/components/templates-admin/gestionDesComptes/gerants/gerants.component';
import { NotairesComponent } from 'src/app/components/templates-admin/gestionDesComptes/notaires/notaires.component';
import { PaysComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/pays/pays.component';
import { ProfilComponent } from 'src/app/components/templates-admin/gestionDesComptes/profil/profil.component';
import { ProprietairesComponent } from 'src/app/components/templates-admin/gestionDesComptes/proprietaires/proprietaires.component';
import { QuartiersComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/quartiers/quartiers.component';
import { RegionsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/regions/regions.component';
import { ResponsablesAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesComptes/responsables-agence-immobiliere/responsables-agence-immobiliere.component';
import { RolesComponent } from 'src/app/components/templates-admin/gestionDesComptes/roles/roles.component';
import { ServicesComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services/services.component';
import { TemplatesAdminComponent } from 'src/app/components/templates-admin/templates-admin.component';
import { TypesDeBienComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/types-de-bien/types-de-bien.component';
import { VillesComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/villes/villes.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AutresServicesComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/autres-services/autres-services.component';
import { NotificationsComponent } from 'src/app/components/templates-admin/notifications/notifications.component';
import { DetailAgentImmobilierComponent } from 'src/app/components/templates-admin/gestionDesComptes/agents-immobiliers/detail-agent-immobilier/detail-agent-immobilier.component';
import { DetailResponsableComponent } from 'src/app/components/templates-admin/gestionDesComptes/responsables-agence-immobiliere/detail-responsable/detail-responsable.component';
import { DetailAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/detail-agence-immobiliere/detail-agence-immobiliere.component';
import { UpdateServiceComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services/update-service/update-service.component';
import { AddServiceComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services/add-service/add-service.component';
import { DetailServiceComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services/detail-service/detail-service.component';

const routes: Routes = [
  { path: '', component: TemplatesAdminComponent, canActivate: [AuthGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'roles', component: RolesComponent, canActivate: [AuthGuard] },
      { path: 'administrateurs', component: AdministrateursComponent, canActivate: [AuthGuard] },
      { path: 'notaires', component: NotairesComponent, canActivate: [AuthGuard] },
      { path: 'proprietaires', component: ProprietairesComponent, canActivate: [AuthGuard] },

      { path: 'responsables', component: ResponsablesAgenceImmobiliereComponent, canActivate: [AuthGuard] },
      { path: 'responsable/:id', component: DetailResponsableComponent, canActivate: [AuthGuard] },

      { path: 'agents-immobiliers', component: AgentsImmobiliersComponent, canActivate: [AuthGuard] },
      { path: 'agent-immobilier/:id', component: DetailAgentImmobilierComponent, canActivate: [AuthGuard] },

      { path: 'demarcheurs', component: DemarcheursComponent, canActivate: [AuthGuard] },
      { path: 'gerants', component: GerantsComponent, canActivate: [AuthGuard] },
      { path: 'clients', component: ClientsComponent, canActivate: [AuthGuard] },
      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres', component: AgencesImmobilieresComponent, canActivate: [AuthGuard] },
      { path: 'agence-immobiliere/:id', component: DetailAgenceImmobiliereComponent, canActivate: [AuthGuard] },

      { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },
      { path: 'add/service', component: AddServiceComponent, canActivate: [AuthGuard] },
      { path: 'service/update/:id', component: UpdateServiceComponent, canActivate: [AuthGuard] },
      { path: 'service/:id', component: DetailServiceComponent, canActivate: [AuthGuard] },

      { path: 'autres-services', component: AutresServicesComponent, canActivate: [AuthGuard] },
      { path: 'autre-service/:id', component: AutresServicesComponent, canActivate: [AuthGuard] },
      { path: 'pays', component: PaysComponent, canActivate: [AuthGuard] },
      { path: 'regions', component: RegionsComponent, canActivate: [AuthGuard] },
      { path: 'villes', component: VillesComponent, canActivate: [AuthGuard] },
      { path: 'quartiers', component: QuartiersComponent, canActivate: [AuthGuard] },
      { path: 'types-de-bien', component: TypesDeBienComponent, canActivate: [AuthGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
