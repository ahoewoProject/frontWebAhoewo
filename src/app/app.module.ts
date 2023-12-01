import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { TemplatesAdminComponent } from './components/templates-admin/templates-admin.component';
import { DashboardComponent } from './components/templates-admin/dashboard/dashboard.component';
import { MenuComponent } from './components/templates-admin/menu/menu.component';
import { PiedDePageComponent } from './components/templates-admin/pied-de-page/pied-de-page.component';
import { NavigationComponent } from './components/templates-admin/navigation/navigation.component';
import { RolesComponent } from './components/templates-admin/gestionDesComptes/roles/roles.component';
import { MenuResponsiveComponent } from './components/templates-admin/menu-responsive/menu-responsive.component';
import { AdministrateursComponent } from './components/templates-admin/gestionDesComptes/administrateurs/administrateurs.component';
import { NotairesComponent } from './components/templates-admin/gestionDesComptes/notaires/notaires.component';
import { ProprietairesComponent } from './components/templates-admin/gestionDesComptes/proprietaires/proprietaires.component';
import { AgentsImmobiliersComponent } from './components/templates-admin/gestionDesComptes/agents-immobiliers/agents-immobiliers.component';
import { DemarcheursComponent } from './components/templates-admin/gestionDesComptes/demarcheurs/demarcheurs.component';
import { GerantsComponent } from './components/templates-admin/gestionDesComptes/gerants/gerants.component';
import { ClientsComponent } from './components/templates-admin/gestionDesComptes/clients/clients.component';
import { ProfilComponent } from './components/templates-admin/gestionDesComptes/profil/profil.component';
import { DemandesCertificationsComponent } from './components/templates-admin/gestionDesComptes/demandes-certifications/demandes-certifications.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { TemplatesClientComponent } from './components/templates-client/templates-client.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GenericFilterPipe } from './helpers/genericFilter';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TokenInterceptorProvider } from './helpers/token.interceptor';
import { AgencesImmobilieresComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/agences-immobilieres.component';
import { ServicesComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/services/services.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TypesDeBienComponent } from './components/templates-admin/gestionDesComptes/types-de-bien/types-de-bien.component';
import { BiensImmobiliersComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-immobiliers.component';
import { DelegationsGestionsComponent } from './components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegations-gestions.component';
import { ResponsablesAgenceImmobiliereComponent } from './components/templates-admin/gestionDesComptes/responsables-agence-immobiliere/responsables-agence-immobiliere.component';
import { ServicesAgenceImmobiliereComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/services-agence-immobiliere.component';
import { PaysComponent } from './components/templates-admin/gestionDesBiensImmobiliers/pays/pays.component';
import { VillesComponent } from './components/templates-admin/gestionDesBiensImmobiliers/villes/villes.component';
import { RegionsComponent } from './components/templates-admin/gestionDesBiensImmobiliers/regions/regions.component';
import { QuartiersComponent } from './components/templates-admin/gestionDesBiensImmobiliers/quartiers/quartiers.component';
import { AdminModule } from './routes/admin/admin.module';
import { AgentImmobilierModule } from './routes/agent-immobilier/agent-immobilier.module';
import { ClientModule } from './routes/client/client.module';
import { GerantModule } from './routes/gerant/gerant.module';
import { ResponsableModule } from './routes/responsable/responsable.module';
import { NotaireModule } from './routes/notaire/notaire.module';
import { ProprietaireModule } from './routes/proprietaire/proprietaire.module';
import { DemarcheurModule } from './routes/demarcheur/demarcheur.module';
import { TabViewModule } from 'primeng/tabview';
import { StepsModule } from 'primeng/steps';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    TemplatesAdminComponent,
    DashboardComponent,
    MenuComponent,
    PiedDePageComponent,
    NavigationComponent,
    RolesComponent,
    MenuResponsiveComponent,
    AdministrateursComponent,
    NotairesComponent,
    ProprietairesComponent,
    AgentsImmobiliersComponent,
    DemarcheursComponent,
    GerantsComponent,
    ClientsComponent,
    ProfilComponent,
    DemandesCertificationsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    TemplatesClientComponent,
    GenericFilterPipe,
    AgencesImmobilieresComponent,
    ServicesComponent,
    TypesDeBienComponent,
    BiensImmobiliersComponent,
    DelegationsGestionsComponent,
    ResponsablesAgenceImmobiliereComponent,
    ServicesAgenceImmobiliereComponent,
    PaysComponent,
    VillesComponent,
    RegionsComponent,
    QuartiersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    PaginatorModule,
    FileUploadModule,
    ToastModule,
    TooltipModule,
    ConfirmDialogModule,
    TagModule,
    DropdownModule,
    AutoCompleteModule,
    ImageModule,
    AccordionModule,
    DividerModule,
    GalleriaModule,
    CheckboxModule,
    RadioButtonModule,
    ProgressSpinnerModule,
    AdminModule,
    AgentImmobilierModule,
    ClientModule,
    GerantModule,
    ResponsableModule,
    NotaireModule,
    ProprietaireModule,
    DemarcheurModule,
    TabViewModule,
    StepsModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    TokenInterceptorProvider,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
