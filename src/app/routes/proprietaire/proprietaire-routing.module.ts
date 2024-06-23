import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BiensImmobiliersComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-immobiliers.component';
import { DashboardComponent } from 'src/app/components/templates-admin/dashboard/dashboard.component';
import { DelegationsGestionsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegations-gestions.component';
import { DemandesCertificationsComponent } from 'src/app/components/templates-admin/gestionDesComptes/demandes-certifications/demandes-certifications.component';
import { GerantsComponent } from 'src/app/components/templates-admin/gestionDesComptes/gerants/gerants.component';
import { ProfilComponent } from 'src/app/components/templates-admin/gestionDesComptes/profil/profil.component';
import { TemplatesAdminComponent } from 'src/app/components/templates-admin/templates-admin.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NotificationsComponent } from 'src/app/components/templates-admin/notifications/notifications.component';
import { PublicationsComponent } from 'src/app/components/templates-admin/gestionDesPublications/publications/publications.component';
import { DemandesVisitesComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-visites/demandes-visites.component';
import { DemandesLocationsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-locations/demandes-locations.component';
import { DemandesAchatsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-achats/demandes-achats.component';
import { ContratsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/contrats/contrats.component';
import { SuivisEntretiensComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/suivis-entretiens.component';
import { PaiementsComponent } from 'src/app/components/templates-admin/gestionDesPaiements/paiements/paiements.component';
import { PlanificationsPaiementsComponent } from 'src/app/components/templates-admin/gestionDesPaiements/planifications-paiements/planifications-paiements.component';
import { ParametresComponent } from 'src/app/components/templates-admin/gestionDesComptes/parametres/parametres.component';
import { BiensAssociesComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/biens-associes.component';
import { BiensContratsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-contrats/biens-contrats.component';
import { BiensPlanificationsPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-planifications-paiements/biens-planifications-paiements.component';
import { BiensPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-paiements/biens-paiements.component';
import { AddBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/add-bien-immobilier/add-bien-immobilier.component';
import { UpdateBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/update-bien-immobilier/update-bien-immobilier.component';
import { DetailBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/detail-bien-immobilier/detail-bien-immobilier.component';
import { AddBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/add-bien-associe/add-bien-associe.component';
import { UpdateBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/update-bien-associe/update-bien-associe.component';
import { DetailBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/detail-bien-associe/detail-bien-associe.component';
import { DetailPublicationComponent } from 'src/app/components/templates-admin/gestionDesPublications/publications/detail-publication/detail-publication.component';
import { UpdatePublicationComponent } from 'src/app/components/templates-admin/gestionDesPublications/publications/update-publication/update-publication.component';
import { DetailDelegationGestionComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/detail-delegation-gestion/detail-delegation-gestion.component';
import { EffectuerPaiementComponent } from 'src/app/components/templates-admin/gestionDesPaiements/planifications-paiements/effectuer-paiement/effectuer-paiement.component';
import { DetailPlanificationPaiementComponent } from 'src/app/components/templates-admin/gestionDesPaiements/planifications-paiements/detail-planification-paiement/detail-planification-paiement.component';
import { DetailPaiementComponent } from 'src/app/components/templates-admin/gestionDesPaiements/paiements/detail-paiement/detail-paiement.component';
import { ProposerContratLocationComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-locations/proposer-contrat-location/proposer-contrat-location.component';
import { ProposerContratVenteComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-achats/proposer-contrat-vente/proposer-contrat-vente.component';
import { DeleguerBienComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/deleguer-bien/deleguer-bien.component';
import { AddSuiviEntretienComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/add-suivi-entretien/add-suivi-entretien.component';
import { UpdateSuiviEntretienComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/update-suivi-entretien/update-suivi-entretien.component';
import { DetailSuiviEntretienComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/detail-suivi-entretien/detail-suivi-entretien.component';

const routes: Routes = [
  { path: '', component: TemplatesAdminComponent, canActivate: [AuthGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'gerants', component: GerantsComponent, canActivate: [AuthGuard] },
      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },

      { path: 'demandes-certifications', component: DemandesCertificationsComponent, canActivate: [AuthGuard] },
      { path: 'demande-certification/:id', component: DemandesCertificationsComponent, canActivate: [AuthGuard] },

      { path: 'biens-supports', component: BiensImmobiliersComponent, canActivate: [AuthGuard] },
      { path: 'bien-support/:id', component: DetailBienImmobilierComponent, canActivate: [AuthGuard] },
      { path: 'add/bien-support', component: AddBienImmobilierComponent, canActivate: [AuthGuard] },
      { path: 'update/bien-support/:id/:designation', component: UpdateBienImmobilierComponent, canActivate: [AuthGuard] },
      { path: 'deleguer/bien-support/:id', component: DeleguerBienComponent, canActivate: [AuthGuard] },

      { path: 'bien-support/:id/biens-associes', component: BiensAssociesComponent, canActivate: [AuthGuard] },
      { path: 'bien-support/:id/bien-associe/:idBienAssocie', component: DetailBienAssocieComponent, canActivate: [AuthGuard] },
      { path: 'bien-support/:id/add/bien-associe', component: AddBienAssocieComponent, canActivate: [AuthGuard] },
      { path: 'bien-support/:id/update/bien-associe/:idBienAssocie/:designation', component: UpdateBienAssocieComponent, canActivate: [AuthGuard] },
      { path: 'bien-support/:id/deleguer/bien-associe/:idBienAssocie', component: DeleguerBienComponent, canActivate: [AuthGuard] },

      { path: 'bien/contrats/:codeBien', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'bien/contrat-location/:idContratLocation', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'bien/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'bien/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },

      { path: 'bien/contrats/planifications-paiements/:codeContrat', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'bien/contrats/planification-paiement/:idPlanificationPaiement', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'bien/contrats/paiements/:codeContrat', component: BiensPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'bien/contrats/paiement/:idPaiement', component: BiensPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'bien-delegue/contrats/:codeBien', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'bien-delegue/contrat-location/:idContratLocation', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'bien-delegue/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },

      { path: 'bien-delegue/contrats/planifications-paiements/:codeContrat', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'bien-delegue/contrats/planification-paiement/:idPlanificationPaiement', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'bien-delegue/contrats/paiements/:codeContrat', component: BiensPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'bien-delegue/contrats/paiement/:idPaiement', component: BiensPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'delegations-gestions', component: DelegationsGestionsComponent, canActivate: [AuthGuard] },
      { path: 'delegation-gestion/:id', component: DetailDelegationGestionComponent, canActivate: [AuthGuard] },

      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },

      { path: 'publications', component: PublicationsComponent, canActivate: [AuthGuard] },
      { path: 'publication/:id', component: DetailPublicationComponent, canActivate: [AuthGuard] },
      { path: 'update/publication/:id', component: UpdatePublicationComponent, canActivate: [AuthGuard] },

      { path: 'demandes-visites', component: DemandesVisitesComponent, canActivate: [AuthGuard] },
      { path: 'demande-visite/:id', component: DemandesVisitesComponent, canActivate: [AuthGuard] },

      { path: 'demandes-locations', component: DemandesLocationsComponent, canActivate: [AuthGuard] },
      { path: 'demande-location/:id', component: DemandesLocationsComponent, canActivate: [AuthGuard] },
      { path: 'demande-location/proposer-contrat/:id', component: ProposerContratLocationComponent, canActivate: [AuthGuard] },

      { path: 'demandes-achats', component: DemandesAchatsComponent, canActivate: [AuthGuard] },
      { path: 'demande-achat/:id', component: DemandesAchatsComponent, canActivate: [AuthGuard] },
      { path: 'demande-achat/proposer-contrat/:id', component: ProposerContratVenteComponent, canActivate: [AuthGuard] },

      { path: 'contrats', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'contrat-location/:id', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'contrat-vente/:id', component: ContratsComponent, canActivate: [AuthGuard] },

      { path: 'suivis-entretiens', component: SuivisEntretiensComponent, canActivate: [AuthGuard] },
      { path: 'add/suivi-entretien/:idContrat', component: AddSuiviEntretienComponent, canActivate: [AuthGuard] },
      { path: 'update/suivi-entretien/:id', component: UpdateSuiviEntretienComponent, canActivate: [AuthGuard] },
      { path: 'suivi-entretien/:id', component: DetailSuiviEntretienComponent, canActivate: [AuthGuard] },

      { path: 'planifications-paiements', component: PlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'planification-paiement/:id', component: DetailPlanificationPaiementComponent, canActivate: [AuthGuard] },
      { path: 'planification-paiement/effectuer-paiement/:id', component: EffectuerPaiementComponent, canActivate: [AuthGuard] },

      { path: 'paiements', component: PaiementsComponent, canActivate: [AuthGuard] },
      { path: 'paiement/:id', component: DetailPaiementComponent, canActivate: [AuthGuard] },

      { path: 'parametres', component: ParametresComponent, canActivate: [AuthGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProprietaireRoutingModule { }
