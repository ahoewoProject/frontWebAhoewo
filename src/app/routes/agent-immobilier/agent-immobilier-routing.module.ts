import { SuivisEntretiensComponent } from './../../components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/suivis-entretiens.component';
import { PublicationsComponent } from '../../components/templates-admin/gestionDesPublications/publications/publications.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencesImmobilieresComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/agences-immobilieres.component';
import { BiensImmobiliersComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-immobiliers.component';
import { DashboardComponent } from 'src/app/components/templates-admin/dashboard/dashboard.component';
import { DelegationsGestionsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegations-gestions.component';
import { ProfilComponent } from 'src/app/components/templates-admin/gestionDesComptes/profil/profil.component';
import { TemplatesAdminComponent } from 'src/app/components/templates-admin/templates-admin.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NotificationsComponent } from 'src/app/components/templates-admin/notifications/notifications.component';
import { DemandesVisitesComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-visites/demandes-visites.component';
import { DemandesAchatsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-achats/demandes-achats.component';
import { DemandesLocationsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-locations/demandes-locations.component';
import { ContratsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/contrats/contrats.component';
import { PaiementsComponent } from 'src/app/components/templates-admin/gestionDesPaiements/paiements/paiements.component';
import { PlanificationsPaiementsComponent } from 'src/app/components/templates-admin/gestionDesPaiements/planifications-paiements/planifications-paiements.component';
import { BiensAssociesComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/biens-associes.component';
import { BiensContratsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-contrats/biens-contrats.component';
import { BiensPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-paiements/biens-paiements.component';
import { BiensPlanificationsPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-planifications-paiements/biens-planifications-paiements.component';
import { DelegationGestionAddComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegation-gestion-add/delegation-gestion-add.component';
import { BienDelegueUpdateComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/bien-delegue-update/bien-delegue-update.component';
import { DetailAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/detail-agence-immobiliere/detail-agence-immobiliere.component';
import { ServicesAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/services-agence-immobiliere.component';
import { DetailServiceAgenceComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/detail-service-agence/detail-service-agence.component';

const routes: Routes = [
  { path: '', component: TemplatesAdminComponent, canActivate: [AuthGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres', component: AgencesImmobilieresComponent, canActivate: [AuthGuard] },
      { path: 'agence-immobiliere/:id', component: DetailAgenceImmobiliereComponent, canActivate: [AuthGuard] },
      { path: 'agence-immobiliere/:id/services', component: ServicesAgenceImmobiliereComponent, canActivate: [AuthGuard] },
      { path: 'agence-immobiliere/service/:id', component: DetailServiceAgenceComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/biens-supports', component: BiensImmobiliersComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens-supports/:id', component: BiensImmobiliersComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens-supports/:id/biens-associes', component: BiensAssociesComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens-supports/:id/biens-associes/:idBienAssocie', component: BiensAssociesComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/biens/contrats/:codeBien', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens/contrat-location/:idContratLocation', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/biens/contrats/planifications-paiements/:codeContrat', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens/contrats/planification-paiement/:idPlanificationPaiement', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/biens/contrats/paiements/:codeContrat', component: BiensPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens/contrats/paiement/:idPaiement', component: BiensPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/biens-delegues/contrats/:codeBien', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens-delegues/contrat-location/:idContratLocation', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens-delegues/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/biens-delegues/contrats/planifications-paiements/:codeContrat', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens-delegues/contrats/planification-paiement/:idPlanificationPaiement', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/biens-delegues/contrats/paiements/:codeContrat', component: BiensPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/biens-delegues/contrats/paiement/:idPaiement', component: BiensPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/delegations-gestions', component: DelegationsGestionsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/delegations-gestions/:id', component: DelegationsGestionsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/delegation-gestion/add', component: DelegationGestionAddComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien-delegue/update/:id/:designation', component: BienDelegueUpdateComponent, canActivate: [AuthGuard] },

      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/publications', component: PublicationsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/publications/:id', component: PublicationsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/demandes-visites', component: DemandesVisitesComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demandes-visites/:id', component: DemandesVisitesComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/demandes-locations', component: DemandesLocationsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demandes-locations/:id', component: DemandesLocationsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/demandes-achats', component: DemandesAchatsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demandes-achats/:id', component: DemandesAchatsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/contrats', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/contrats/locations/:id', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/contrats/ventes/:id', component: ContratsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/suivis-entretiens', component: SuivisEntretiensComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/suivis-entretiens/:id', component: SuivisEntretiensComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/planifications-paiements', component: PlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/planifications-paiements/:id', component: PlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/paiements', component: PaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/paiements/:id', component: PaiementsComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentImmobilierRoutingModule { }
