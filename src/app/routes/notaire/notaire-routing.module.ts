import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/components/templates-admin/dashboard/dashboard.component';
import { DemandesCertificationsComponent } from 'src/app/components/templates-admin/gestionDesComptes/demandes-certifications/demandes-certifications.component';
import { ProfilComponent } from 'src/app/components/templates-admin/gestionDesComptes/profil/profil.component';
import { DemandesAchatsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-achats/demandes-achats.component';
import { DemandesLocationsComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-locations/demandes-locations.component';
import { DemandesVisitesComponent } from 'src/app/components/templates-admin/gestionDesLocationsEtVentes/demandes-visites/demandes-visites.component';
import { NotificationsComponent } from 'src/app/components/templates-admin/notifications/notifications.component';
import { TemplatesAdminComponent } from 'src/app/components/templates-admin/templates-admin.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: '', component: TemplatesAdminComponent, canActivate: [AuthGuard],
    children:[
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
      { path: 'demandes-certifications', component: DemandesCertificationsComponent, canActivate: [AuthGuard] },
      { path: 'demandes-certifications/:id', component: DemandesCertificationsComponent, canActivate: [AuthGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
      { path: 'demandes-visites', component: DemandesVisitesComponent, canActivate: [AuthGuard] },
      { path: 'demandes-visites/:id', component: DemandesVisitesComponent, canActivate: [AuthGuard] },
      { path: 'demandes-locations', component: DemandesLocationsComponent, canActivate: [AuthGuard] },
      { path: 'demandes-locations/:id', component: DemandesLocationsComponent, canActivate: [AuthGuard] },
      { path: 'demandes-achats', component: DemandesAchatsComponent, canActivate: [AuthGuard] },
      { path: 'demandes-achats/:id', component: DemandesAchatsComponent, canActivate: [AuthGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotaireRoutingModule { }
