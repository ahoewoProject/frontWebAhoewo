import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencesImmobilieresComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/agences-immobilieres.component';
import { AgentsImmobiliersComponent } from 'src/app/components/templates-admin/gestionDesComptes/agents-immobiliers/agents-immobiliers.component';
import { DashboardComponent } from 'src/app/components/templates-admin/dashboard/dashboard.component';
import { DemandesCertificationsComponent } from 'src/app/components/templates-admin/gestionDesComptes/demandes-certifications/demandes-certifications.component';
import { ProfilComponent } from 'src/app/components/templates-admin/gestionDesComptes/profil/profil.component';
import { ServicesAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/services-agence-immobiliere.component';
import { TemplatesAdminComponent } from 'src/app/components/templates-admin/templates-admin.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { BiensImmobiliersComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-immobiliers.component';
import { DelegationsGestionsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegations-gestions.component';
import { ResponsablesAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesComptes/responsables-agence-immobiliere/responsables-agence-immobiliere.component';
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
import { BiensPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-paiements/biens-paiements.component';
import { BiensPlanificationsPaiementsComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-planifications-paiements/biens-planifications-paiements.component';
import { BienDelegueUpdateComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/bien-delegue-update/bien-delegue-update.component';
import { DelegationGestionAddComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegation-gestion-add/delegation-gestion-add.component';
import { AgentImmobilierAddComponent } from 'src/app/components/templates-admin/gestionDesComptes/agents-immobiliers/agent-immobilier-add/agent-immobilier-add.component';
import { ResponsableAgenceAddComponent } from 'src/app/components/templates-admin/gestionDesComptes/responsables-agence-immobiliere/responsable-agence-add/responsable-agence-add.component';
import { DetailAgentImmobilierComponent } from 'src/app/components/templates-admin/gestionDesComptes/agents-immobiliers/detail-agent-immobilier/detail-agent-immobilier.component';
import { DetailResponsableComponent } from 'src/app/components/templates-admin/gestionDesComptes/responsables-agence-immobiliere/detail-responsable/detail-responsable.component';
import { UpdateAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/update-agence-immobiliere/update-agence-immobiliere.component';
import { AddAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/add-agence-immobiliere/add-agence-immobiliere.component';
import { DetailAgenceImmobiliereComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/detail-agence-immobiliere/detail-agence-immobiliere.component';
import { AddServiceAgenceComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/add-service-agence/add-service-agence.component';
import { DetailServiceAgenceComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/detail-service-agence/detail-service-agence.component';
import { UpdateServiceAgenceComponent } from 'src/app/components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/update-service-agence/update-service-agence.component';
import { DetailPublicationComponent } from 'src/app/components/templates-admin/gestionDesPublications/publications/detail-publication/detail-publication.component';
import { UpdatePublicationComponent } from 'src/app/components/templates-admin/gestionDesPublications/publications/update-publication/update-publication.component';
import { DetailDelegationGestionComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/detail-delegation-gestion/detail-delegation-gestion.component';
import { DetailBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/detail-bien-immobilier/detail-bien-immobilier.component';
import { AddBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/add-bien-immobilier/add-bien-immobilier.component';
import { UpdateBienImmobilierComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/update-bien-immobilier/update-bien-immobilier.component';
import { AddBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/add-bien-associe/add-bien-associe.component';
import { DetailBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/detail-bien-associe/detail-bien-associe.component';
import { UpdateBienAssocieComponent } from 'src/app/components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/update-bien-associe/update-bien-associe.component';
import { EffectuerPaiementComponent } from 'src/app/components/templates-admin/gestionDesPaiements/planifications-paiements/effectuer-paiement/effectuer-paiement.component';
import { DetailPlanificationPaiementComponent } from 'src/app/components/templates-admin/gestionDesPaiements/planifications-paiements/detail-planification-paiement/detail-planification-paiement.component';
import { DetailPaiementComponent } from 'src/app/components/templates-admin/gestionDesPaiements/paiements/detail-paiement/detail-paiement.component';
import { ProposerContratLocationComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-locations/proposer-contrat-location/proposer-contrat-location.component';
import { ProposerContratVenteComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-achats/proposer-contrat-vente/proposer-contrat-vente.component';
import { AddSuiviEntretienComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/add-suivi-entretien/add-suivi-entretien.component';
import { UpdateSuiviEntretienComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/update-suivi-entretien/update-suivi-entretien.component';
import { DetailSuiviEntretienComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/detail-suivi-entretien/detail-suivi-entretien.component';

const routes: Routes = [
  { path: '', component: TemplatesAdminComponent, canActivate: [AuthGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/co-responsables', component: ResponsablesAgenceImmobiliereComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/co-responsable/:id', component: DetailResponsableComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/add/co-responsable', component: ResponsableAgenceAddComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/agents-immobiliers', component: AgentsImmobiliersComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/agent-immobilier/:id', component: DetailAgentImmobilierComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/add/agent-immobilier', component: AgentImmobilierAddComponent, canActivate: [AuthGuard] },

      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },

      { path: 'demandes-certifications', component: DemandesCertificationsComponent, canActivate: [AuthGuard] },
      { path: 'demande-certification/:id', component: DemandesCertificationsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres', component: AgencesImmobilieresComponent, canActivate: [AuthGuard] },
      { path: 'add/agence-immobiliere', component: AddAgenceImmobiliereComponent, canActivate: [AuthGuard] },
      { path: 'update/agence-immobiliere/:id', component: UpdateAgenceImmobiliereComponent, canActivate: [AuthGuard] },
      { path: 'agence-immobiliere/:id', component: DetailAgenceImmobiliereComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/services', component: ServicesAgenceImmobiliereComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/service/:id', component: DetailServiceAgenceComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/add/service', component: AddServiceAgenceComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/update/service/:id', component: UpdateServiceAgenceComponent, canActivate: [AuthGuard] },

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

      { path: 'agences-immobilieres/notifications', component: NotificationsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/publications',  component: PublicationsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/publication/:id',  component: DetailPublicationComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/update/publication/:id',  component: UpdatePublicationComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/demandes-visites', component: DemandesVisitesComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demande-visite/:id', component: DemandesVisitesComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/demandes-locations', component: DemandesLocationsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demande-location/:id', component: DemandesLocationsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demande-location/proposer-contrat/:id', component: ProposerContratLocationComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/demandes-achats', component: DemandesAchatsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demande-achat/:id', component: DemandesAchatsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/demande-achat/proposer-contrat/:id', component: ProposerContratVenteComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/contrats', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/contrat-location/:id', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/contrat-vente/:id', component: ContratsComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/suivis-entretiens', component: SuivisEntretiensComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/add/suivi-entretien/:idContrat', component: AddSuiviEntretienComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/update/suivi-entretien/:id', component: UpdateSuiviEntretienComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/suivi-entretien/:id', component: DetailSuiviEntretienComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/planifications-paiements', component: PlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/planification-paiement/:id', component: DetailPlanificationPaiementComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/planification-paiement/effectuer-paiement/:id', component: EffectuerPaiementComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/paiements', component: PaiementsComponent, canActivate: [AuthGuard] },
      { path: 'agences-immobilieres/paiement/:id', component: DetailPaiementComponent, canActivate: [AuthGuard] },

      { path: 'agences-immobilieres/parametres', component: ParametresComponent, canActivate: [AuthGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsableRoutingModule { }
