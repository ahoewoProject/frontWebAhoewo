import { DemandesLocationsComponent } from './../../components/templates-admin/gestionDesLocationsEtVentes/demandes-locations/demandes-locations.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/components/templates-admin/dashboard/dashboard.component';
import { ProfilComponent } from 'src/app/components/templates-admin/gestionDesComptes/profil/profil.component';
import { ContratsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/contrats/contrats.component';
import { DemandesAchatsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-achats/demandes-achats.component';
import { DemandesVisitesComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-visites/demandes-visites.component';
import { SuivisEntretiensComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/suivis-entretiens.component';
import { DetailPaiementComponent } from 'src/app/components/templates-admin/gestionDesPaiements/paiements/detail-paiement/detail-paiement.component';
import { PaiementsComponent } from 'src/app/components/templates-admin/gestionDesPaiements/paiements/paiements.component';
import { DetailPlanificationPaiementComponent } from 'src/app/components/templates-admin/gestionDesPaiements/planifications-paiements/detail-planification-paiement/detail-planification-paiement.component';
import { EffectuerPaiementComponent } from 'src/app/components/templates-admin/gestionDesPaiements/planifications-paiements/effectuer-paiement/effectuer-paiement.component';
import { PlanificationsPaiementsComponent } from 'src/app/components/templates-admin/gestionDesPaiements/planifications-paiements/planifications-paiements.component';
import { NotificationsComponent } from 'src/app/components/templates-admin/notifications/notifications.component';
import { TemplatesAdminComponent } from 'src/app/components/templates-admin/templates-admin.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: '', component: TemplatesAdminComponent, canActivate: [AuthGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },

      { path: 'demandes-visites', component: DemandesVisitesComponent, canActivate: [AuthGuard] },
      { path: 'demande-visite/:id', component: DemandesVisitesComponent, canActivate: [AuthGuard] },

      { path: 'demandes-locations', component: DemandesLocationsComponent, canActivate: [AuthGuard] },
      { path: 'demande-location/:id', component: DemandesLocationsComponent, canActivate: [AuthGuard] },

      { path: 'demandes-achats', component: DemandesAchatsComponent, canActivate: [AuthGuard] },
      { path: 'demande-achat/:id', component: DemandesAchatsComponent, canActivate: [AuthGuard] },

      { path: 'contrats', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'contrat-location/:id', component: ContratsComponent, canActivate: [AuthGuard] },
      { path: 'contrat-vente/:id', component: ContratsComponent, canActivate: [AuthGuard] },

      { path: 'suivis-entretiens', component: SuivisEntretiensComponent, canActivate: [AuthGuard] },
      { path: 'suivi-entretien/:id', component: SuivisEntretiensComponent, canActivate: [AuthGuard] },

      { path: 'planifications-paiements', component: PlanificationsPaiementsComponent, canActivate: [AuthGuard] },
      { path: 'planification-paiement/:id', component: DetailPlanificationPaiementComponent, canActivate: [AuthGuard] },
      { path: 'planification-paiement/effectuer-paiement/:id', component: EffectuerPaiementComponent, canActivate: [AuthGuard] },

      { path: 'paiements', component: PaiementsComponent, canActivate: [AuthGuard] },
      { path: 'paiement/:id', component: DetailPaiementComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
