import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/components/templates-admin/dashboard/dashboard.component';
import { DelegationsGestionsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegations-gestions.component';
import { ProfilComponent } from 'src/app/components/templates-admin/gestionDesComptes/profil/profil.component';
import { NotificationsComponent } from 'src/app/components/templates-admin/notifications/notifications.component';
import { PublicationsComponent } from 'src/app/components/templates-admin/gestionDesPublications/publications/publications.component';
import { TemplatesAdminComponent } from 'src/app/components/templates-admin/templates-admin.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DemandesVisitesComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-visites/demandes-visites.component';
import { DemandesLocationsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-locations/demandes-locations.component';
import { DemandesAchatsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-achats/demandes-achats.component';
import { ContratsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/contrats/contrats.component';
import { SuivisEntretiensComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/suivis-entretiens.component';
import { PaiementsComponent } from 'src/app/components/templates-admin/gestionDesPaiements/paiements/paiements.component';
import { PlanificationsPaiementsComponent } from 'src/app/components/templates-admin/gestionDesPaiements/planifications-paiements/planifications-paiements.component';
import { BiensContratsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-contrats/biens-contrats.component';
import { BiensPlanificationsPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-planifications-paiements/biens-planifications-paiements.component';
import { BiensPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-paiements/biens-paiements.component';
import { DelegationGestionAddComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegation-gestion-add/delegation-gestion-add.component';
import { BienDelegueUpdateComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/bien-delegue-update/bien-delegue-update.component';

const routes: Routes = [
  { path: '', component: TemplatesAdminComponent, canActivate: [AuthGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },

      { path: 'biens-delegues/contrats/:codeBien', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'biens-delegues/contrat-location/:idContratLocation', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'biens-delegues/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },

      { path: 'biens-delegues/contrats/planifications-paiements/:codeContrat', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'biens-delegues/contrats/planification-paiement/:idPlanificationPaiement', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'biens-delegues/contrats/paiements/:codeContrat', component: BiensPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'biens-delegues/contrats/paiement/:idPaiement', component: BiensPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'delegations-gestions', component: DelegationsGestionsComponent, canActivate: [AuthGuard] },
      { path: 'delegations-gestions/:id', component: DelegationsGestionsComponent, canActivate: [AuthGuard] },

      { path: 'delegation-gestion/add', component: DelegationGestionAddComponent, canActivate: [AuthGuard] },
      { path: 'bien-delegue/update/:id/:designation', component: BienDelegueUpdateComponent, canActivate: [AuthGuard] },

      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },

      { path: 'publications', component: PublicationsComponent, canActivate: [AuthGuard] },
      { path: 'publications/:id', component: PublicationsComponent, canActivate: [AuthGuard] },

      { path: 'demandes-visites', component: DemandesVisitesComponent, canActivate: [AuthGuard] },
      { path: 'demandes-visites/:id', component: DemandesVisitesComponent, canActivate: [AuthGuard] },

      { path: 'demandes-locations', component: DemandesLocationsComponent, canActivate: [AuthGuard] },
      { path: 'demandes-locations/:id', component: DemandesLocationsComponent, canActivate: [AuthGuard] },

      { path: 'demandes-achats', component: DemandesAchatsComponent, canActivate: [AuthGuard] },
      { path: 'demandes-achats/:id', component: DemandesAchatsComponent, canActivate: [AuthGuard] },

      { path: 'contrats', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'contrats/locations/:id', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'contrats/ventes/:id', component: ContratsComponent, canActivate: [AuthGuard] },

      { path: 'suivis-entretiens', component: SuivisEntretiensComponent, canActivate: [AuthGuard] },
      { path: 'suivis-entretiens/:id', component: SuivisEntretiensComponent, canActivate: [AuthGuard] },

      { path: 'planifications-paiements', component: PlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'planifications-paiements/:id', component: PlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'paiements', component: PaiementsComponent, canActivate: [AuthGuard] },
      { path: 'paiements/:id', component: PaiementsComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerantRoutingModule { }
