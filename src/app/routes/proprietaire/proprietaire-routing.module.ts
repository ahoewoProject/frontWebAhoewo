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
import { BiensPlanificationsPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-planifications-paiements/biens-planifications-paiements.component';
import { BiensPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-paiements/biens-paiements.component';
import { AddBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/add-bien-immobilier/add-bien-immobilier.component';
import { UpdateBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/update-bien-immobilier/update-bien-immobilier.component';
import { DetailBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/detail-bien-immobilier/detail-bien-immobilier.component';
import { AddBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/add-bien-associe/add-bien-associe.component';
import { UpdateBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/update-bien-associe/update-bien-associe.component';
import { DetailBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/detail-bien-associe/detail-bien-associe.component';
import { DetailPublicationComponent } from 'src/app/components/templates-admin/gestionDesPublications/publications/detail-publication/detail-publication.component';
import { UpdatePublicationComponent } from 'src/app/components/templates-admin/gestionDesPublications/publications/update-publication/update-publication.component';
import { DetailDelegationGestionComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/detail-delegation-gestion/detail-delegation-gestion.component';

const routes: Routes = [
  { path: '', component: TemplatesAdminComponent, canActivate: [AuthGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'gerants', component: GerantsComponent, canActivate: [AuthGuard] },
      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },

      { path: 'demandes-certifications', component: DemandesCertificationsComponent, canActivate: [AuthGuard] },
      { path: 'demandes-certifications/:id', component: DemandesCertificationsComponent, canActivate: [AuthGuard] },

      { path: 'biens-supports', component: BiensImmobiliersComponent, canActivate: [AuthGuard] },
      { path: 'add/bien-support', component: AddBienImmobilierComponent, canActivate: [AuthGuard] },
      { path: 'update/bien-support/:id', component: UpdateBienImmobilierComponent, canActivate: [AuthGuard] },
      { path: 'bien-support/:id', component: DetailBienImmobilierComponent, canActivate: [AuthGuard] },

      { path: 'biens-supports/:id', component: BiensImmobiliersComponent, canActivate: [AuthGuard] },
      { path: 'biens-supports/:id/biens-associes', component: BiensAssociesComponent, canActivate: [AuthGuard] },

      { path: 'bien-support/:id/biens-associes', component: BiensAssociesComponent, canActivate: [AuthGuard] },

      { path: 'bien-support/:id/add/bien-associe', component: AddBienAssocieComponent, canActivate: [AuthGuard] },
      { path: 'bien-support/:id/update/bien-associe', component: UpdateBienAssocieComponent, canActivate: [AuthGuard] },
      { path: 'bien-support/:id/bien-associe/:idBienAssocie', component: DetailBienAssocieComponent, canActivate: [AuthGuard] },

      { path: 'biens-supports/:id/biens-associes/:idBienAssocie', component: BiensAssociesComponent, canActivate: [AuthGuard] },

      { path: 'biens/contrats/:codeBien', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'biens/contrat-location/:idContratLocation', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'biens/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'biens/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },

      { path: 'biens/contrats/planifications-paiements/:codeContrat', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'biens/contrats/planification-paiement/:idPlanificationPaiement', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'biens/contrats/paiements/:codeContrat', component: BiensPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'biens/contrats/paiement/:idPaiement', component: BiensPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'biens-delegues/contrats/:codeBien', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'biens-delegues/contrat-location/:idContratLocation', component: BiensContratsComponent, canActivate: [AuthGuard] },
      { path: 'biens-delegues/contrat-vente/:idContratVente', component: BiensContratsComponent, canActivate: [AuthGuard] },

      { path: 'biens-delegues/contrats/planifications-paiements/:codeContrat', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'biens-delegues/contrats/planification-paiement/:idPlanificationPaiement', component: BiensPlanificationsPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'biens-delegues/contrats/paiements/:codeContrat', component: BiensPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'biens-delegues/contrats/paiement/:idPaiement', component: BiensPaiementsComponent, canActivate: [AuthGuard] },

      { path: 'delegations-gestions', component: DelegationsGestionsComponent, canActivate: [AuthGuard] },
      { path: 'delegations-gestions/:id', component: DelegationsGestionsComponent, canActivate: [AuthGuard] },
      { path: 'delegation-gestion/:id', component: DetailDelegationGestionComponent, canActivate: [AuthGuard] },

      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },

      { path: 'publications', component: PublicationsComponent, canActivate: [AuthGuard] },
      { path: 'publications/:id', component: PublicationsComponent, canActivate: [AuthGuard] },
      { path: 'publication/:id', component: DetailPublicationComponent, canActivate: [AuthGuard] },
      { path: 'update/publication/:id', component: UpdatePublicationComponent, canActivate: [AuthGuard] },

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
      { path: 'paiements/:id', component: PaiementsComponent, canActivate: [AuthGuard] },

      { path: 'parametres', component: ParametresComponent, canActivate: [AuthGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProprietaireRoutingModule { }
