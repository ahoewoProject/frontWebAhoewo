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
import { BiensPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-paiements/biens-paiements.component';
import { BiensPlanificationsPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-planifications-paiements/biens-planifications-paiements.component';
import { DelegationGestionAddComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegation-gestion-add/delegation-gestion-add.component';
import { BienDelegueUpdateComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/bien-delegue-update/bien-delegue-update.component';
import { DetailAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/detail-agence-immobiliere/detail-agence-immobiliere.component';
import { ServicesAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/services-agence-immobiliere.component';
import { DetailServiceAgenceComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/detail-service-agence/detail-service-agence.component';
import { UpdatePublicationComponent } from 'src/app/components/templates-admin/gestionDesPublications/publications/update-publication/update-publication.component';
import { DetailPublicationComponent } from 'src/app/components/templates-admin/gestionDesPublications/publications/detail-publication/detail-publication.component';
import { DetailDelegationGestionComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/detail-delegation-gestion/detail-delegation-gestion.component';
import { AddBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/add-bien-associe/add-bien-associe.component';
import { UpdateBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/update-bien-associe/update-bien-associe.component';
import { DetailBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/detail-bien-associe/detail-bien-associe.component';
import { UpdateBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/update-bien-immobilier/update-bien-immobilier.component';
import { AddBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/add-bien-immobilier/add-bien-immobilier.component';
import { DetailBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/detail-bien-immobilier/detail-bien-immobilier.component';

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
      { path: 'agences-immobilieres/bien-support/:id', component: DetailBienImmobilierComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/add/bien-support', component: AddBienImmobilierComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/update/bien-support/:id/:designation', component: UpdateBienImmobilierComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/bien-support/:id/biens-associes', component: BiensAssociesComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien-support/:id/bien-associe/:idBienAssocie', component: DetailBienAssocieComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien-support/:id/add/bien-associe', component: AddBienAssocieComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien-support/:id/update/bien-associe/:idBienAssocie/:designation', component: UpdateBienAssocieComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/bien/contrats/:codeBien', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien/contrat-location/:idContratLocation', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/bien/contrats/planifications-paiements/:codeContrat', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien/contrats/planification-paiement/:idPlanificationPaiement', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/bien/contrats/paiements/:codeContrat', component: BiensPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien/contrats/paiement/:idPaiement', component: BiensPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/bien-delegue/contrats/:codeBien', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien-delegue/contrat-location/:idContratLocation', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien-delegue/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/bien-delegue/contrats/planifications-paiements/:codeContrat', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien-delegue/contrats/planification-paiement/:idPlanificationPaiement', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/bien-delegue/contrats/paiements/:codeContrat', component: BiensPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien-delegue/contrats/paiement/:idPaiement', component: BiensPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/delegations-gestions', component: DelegationsGestionsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/delegation-gestion/:id', component: DetailDelegationGestionComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/add/delegation-gestion', component: DelegationGestionAddComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/bien-delegue/update/:id/:designation', component: BienDelegueUpdateComponent, canActivate: [AuthGuard] },

      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/publications', component: PublicationsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/publication/:id', component: DetailPublicationComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/update/publication/:id', component: UpdatePublicationComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/demandes-visites', component: DemandesVisitesComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demande-visite/:id', component: DemandesVisitesComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/demandes-locations', component: DemandesLocationsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demande-location/:id', component: DemandesLocationsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/demandes-achats', component: DemandesAchatsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demande-achat/:id', component: DemandesAchatsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/contrats', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/contrat-location/:id', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/contrat-vente/:id', component: ContratsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/suivis-entretiens', component: SuivisEntretiensComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/suivi-entretien/:id', component: SuivisEntretiensComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/planifications-paiements', component: PlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/planification-paiement/:id', component: PlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/paiements', component: PaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/paiement/:id', component: PaiementsComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentImmobilierRoutingModule { }
