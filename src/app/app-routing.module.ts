import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { TemplatesClientComponent } from './components/templates-client/templates-client.component';
import { AccueilComponent } from './components/templates-client/accueil/accueil.component';
import { ListeAgencesComponent } from './components/templates-client/agences-immobilieres/liste-agences/liste-agences.component';
import { DetailsAgenceComponent } from './components/templates-client/agences-immobilieres/details-agence/details-agence.component';
import { ListePublicationsComponent } from './components/templates-client/annonces-immobilieres/liste-publications/liste-publications.component';
import { DetailsPublicationComponent } from './components/templates-client/annonces-immobilieres/details-publication/details-publication.component';

const routes: Routes = [
  { path: '', redirectTo:'', pathMatch: 'full'},
  { path: '', component: TemplatesClientComponent,
    children:[
      {
        path: '',
        component: AccueilComponent
      },
      {
        path: 'annonces-immobilieres',
        component: ListePublicationsComponent,
      },
      {
        path: 'annonce-immobiliere',
        component: DetailsPublicationComponent
      },
      {
        path: 'agences-immobilieres',
        component: ListeAgencesComponent
      },
      {
        path: 'agence-immobiliere/:nomAgence',
        component: DetailsAgenceComponent
      },
    ]
  },
  { path: 'connexion', component: LoginComponent },
  { path: 'inscription', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'admin', loadChildren: () => import('./routes/admin/admin.module').then(m => m.AdminModule) },
  { path: 'notaire', loadChildren: () => import('./routes/notaire/notaire.module').then(m => m.NotaireModule) },
  { path: 'responsable', loadChildren: () => import('./routes/responsable/responsable.module').then(m => m.ResponsableModule) },
  { path: 'agent-immobilier', loadChildren: () => import('./routes/agent-immobilier/agent-immobilier.module').then(m => m.AgentImmobilierModule) },
  { path: 'proprietaire', loadChildren: () => import('./routes/proprietaire/proprietaire.module').then(m => m.ProprietaireModule) },
  { path: 'gerant', loadChildren: () => import('./routes/gerant/gerant.module').then(m => m.GerantModule) },
  { path: 'demarcheur', loadChildren: () => import('./routes/demarcheur/demarcheur.module').then(m => m.DemarcheurModule) },
  { path: 'client', loadChildren: () => import('./routes/client/client.module').then(m => m.ClientModule) },

];

const routerOptions:ExtraOptions ={
  scrollPositionRestoration:'enabled',
  // anchorScrolling:'enabled',
};

@NgModule({
imports:[RouterModule.forRoot(routes,routerOptions)],
exports:[RouterModule],
})
export class AppRoutingModule { }
