import { LOCALE_ID, NgModule } from '@angular/core';
import * as fr from '@angular/common/locales/fr';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, DecimalPipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
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
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TypesDeBienComponent } from './components/templates-admin/gestionDesBiensImmobiliers/types-de-bien/types-de-bien.component';
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
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { BadgeModule } from 'primeng/badge';
import { AutresServicesComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/autres-services/autres-services.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CarouselModule } from 'primeng/carousel';
import { NotificationsComponent } from './components/templates-admin/notifications/notifications.component';
import { AccueilComponent } from './components/templates-client/accueil/accueil.component';
import { NavigationSiteComponent } from './components/templates-client/navigation-site/navigation-site.component';
import { PiedDePageSiteComponent } from './components/templates-client/pied-de-page-site/pied-de-page-site.component';
import { ListeAgencesComponent } from './components/templates-client/agences-immobilieres/liste-agences/liste-agences.component';
import { DetailsAgenceComponent } from './components/templates-client/agences-immobilieres/details-agence/details-agence.component';
import { FilterService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { CalendarModule } from 'primeng/calendar';
import { EditorModule } from 'primeng/editor';
import { PublicationsComponent } from './components/templates-admin/gestionDesPublications/publications/publications.component';
import { ListePublicationsComponent } from './components/templates-client/annonces-immobilieres/liste-publications/liste-publications.component';
import { DetailsPublicationComponent } from './components/templates-client/annonces-immobilieres/details-publication/details-publication.component';
import { DemandesVisitesComponent } from './components/templates-admin/gestionDesLocationsEtVentes/demandes-visites/demandes-visites.component';
import { DemandesLocationsComponent } from './components/templates-admin/gestionDesLocationsEtVentes/demandes-locations/demandes-locations.component';
import { DemandesAchatsComponent } from './components/templates-admin/gestionDesLocationsEtVentes/demandes-achats/demandes-achats.component';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ContratsComponent } from './components/templates-admin/gestionDesLocationsEtVentes/contrats/contrats.component';
import { SuivisEntretiensComponent } from './components/templates-admin/gestionDesLocationsEtVentes/suivis-entretiens/suivis-entretiens.component';
import { PlanificationsPaiementsComponent } from './components/templates-admin/gestionDesPaiements/planifications-paiements/planifications-paiements.component';
import { PaiementsComponent } from './components/templates-admin/gestionDesPaiements/paiements/paiements.component';
import { ParametresComponent } from './components/templates-admin/gestionDesComptes/parametres/parametres.component';
import { ChartModule } from 'primeng/chart';
import { GestionDesComptesComponent } from './components/templates-admin/dashboard/gestion-des-comptes/gestion-des-comptes.component';
import { GestionDesAgencesImmobieresComponent } from './components/templates-admin/dashboard/gestion-des-agences-immobieres/gestion-des-agences-immobieres.component';
import { GestionDesBiensImmobiliersComponent } from './components/templates-admin/dashboard/gestion-des-biens-immobiliers/gestion-des-biens-immobiliers.component';
import { GestionDesPublicationsComponent } from './components/templates-admin/dashboard/gestion-des-publications/gestion-des-publications.component';
import { GestionDesLocationsEtVentesComponent } from './components/templates-admin/dashboard/gestion-des-locations-et-ventes/gestion-des-locations-et-ventes.component';
import { GestionDesPaiementsComponent } from './components/templates-admin/dashboard/gestion-des-paiements/gestion-des-paiements.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { BiensAssociesComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/biens-associes.component';
import { MenuClientComponent } from './components/templates-admin/menu/menu-client/menu-client.component';
import { MenuAdminComponent } from './components/templates-admin/menu/menu-admin/menu-admin.component';
import { MenuAgentImmobilierComponent } from './components/templates-admin/menu/menu-agent-immobilier/menu-agent-immobilier.component';
import { MenuResponsableComponent } from './components/templates-admin/menu/menu-responsable/menu-responsable.component';
import { MenuGerantComponent } from './components/templates-admin/menu/menu-gerant/menu-gerant.component';
import { MenuDemarcheurComponent } from './components/templates-admin/menu/menu-demarcheur/menu-demarcheur.component';
import { MenuNotaireComponent } from './components/templates-admin/menu/menu-notaire/menu-notaire.component';
import { MenuProprietaireComponent } from './components/templates-admin/menu/menu-proprietaire/menu-proprietaire.component';
import { BiensContratsComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-contrats/biens-contrats.component';
import { BiensPlanificationsPaiementsComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-planifications-paiements/biens-planifications-paiements.component';
import { BiensPaiementsComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-paiements/biens-paiements.component';
import { DelegationGestionAddComponent } from './components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/delegation-gestion-add/delegation-gestion-add.component';
import { BienDelegueUpdateComponent } from './components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/bien-delegue-update/bien-delegue-update.component';
import { SidebarModule } from 'primeng/sidebar';
import { AgentImmobilierAddComponent } from './components/templates-admin/gestionDesComptes/agents-immobiliers/agent-immobilier-add/agent-immobilier-add.component';
import { ResponsableAgenceAddComponent } from './components/templates-admin/gestionDesComptes/responsables-agence-immobiliere/responsable-agence-add/responsable-agence-add.component';
import { DetailResponsableComponent } from './components/templates-admin/gestionDesComptes/responsables-agence-immobiliere/detail-responsable/detail-responsable.component';
import { DetailAgentImmobilierComponent } from './components/templates-admin/gestionDesComptes/agents-immobiliers/detail-agent-immobilier/detail-agent-immobilier.component';
import { AddAgenceImmobiliereComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/add-agence-immobiliere/add-agence-immobiliere.component';
import { UpdateAgenceImmobiliereComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/update-agence-immobiliere/update-agence-immobiliere.component';
import { DetailAgenceImmobiliereComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/agences-immobilieres/detail-agence-immobiliere/detail-agence-immobiliere.component';
import { DetailServiceAgenceComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/detail-service-agence/detail-service-agence.component';
import { AddServiceAgenceComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/add-service-agence/add-service-agence.component';
import { UpdateServiceAgenceComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/services-agence-immobiliere/update-service-agence/update-service-agence.component';
import { UpdateServiceComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/services/update-service/update-service.component';
import { AddServiceComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/services/add-service/add-service.component';
import { DetailServiceComponent } from './components/templates-admin/gestionDesAgencesImmobilieres/services/detail-service/detail-service.component';
import { AddBienImmobilierComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/add-bien-immobilier/add-bien-immobilier.component';
import { UpdateBienImmobilierComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/update-bien-immobilier/update-bien-immobilier.component';
import { AddBienAssocieComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/add-bien-associe/add-bien-associe.component';
import { UpdateBienAssocieComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/update-bien-associe/update-bien-associe.component';
import { DetailBienAssocieComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/biens-associes/detail-bien-associe/detail-bien-associe.component';
import { DetailBienImmobilierComponent } from './components/templates-admin/gestionDesBiensImmobiliers/biens-immobiliers/detail-bien-immobilier/detail-bien-immobilier.component';
import { DetailDelegationGestionComponent } from './components/templates-admin/gestionDesBiensImmobiliers/delegations-gestions/detail-delegation-gestion/detail-delegation-gestion.component';
import { DetailPublicationComponent } from './components/templates-admin/gestionDesPublications/publications/detail-publication/detail-publication.component';
import { UpdatePublicationComponent } from './components/templates-admin/gestionDesPublications/publications/update-publication/update-publication.component';
import { EffectuerPaiementComponent } from './components/templates-admin/gestionDesPaiements/planifications-paiements/effectuer-paiement/effectuer-paiement.component';
import { DetailPlanificationPaiementComponent } from './components/templates-admin/gestionDesPaiements/planifications-paiements/detail-planification-paiement/detail-planification-paiement.component';
import { DetailPaiementComponent } from './components/templates-admin/gestionDesPaiements/paiements/detail-paiement/detail-paiement.component';

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
    QuartiersComponent,
    AutresServicesComponent,
    NotificationsComponent,
    AccueilComponent,
    NavigationSiteComponent,
    PiedDePageSiteComponent,
    ListeAgencesComponent,
    DetailsAgenceComponent,
    PublicationsComponent,
    ListePublicationsComponent,
    DetailsPublicationComponent,
    DemandesVisitesComponent,
    DemandesLocationsComponent,
    DemandesAchatsComponent,
    ContratsComponent,
    SuivisEntretiensComponent,
    PlanificationsPaiementsComponent,
    PaiementsComponent,
    ParametresComponent,
    GestionDesComptesComponent,
    GestionDesAgencesImmobieresComponent,
    GestionDesBiensImmobiliersComponent,
    GestionDesPublicationsComponent,
    GestionDesLocationsEtVentesComponent,
    GestionDesPaiementsComponent,
    BiensAssociesComponent,
    MenuClientComponent,
    MenuAdminComponent,
    MenuAgentImmobilierComponent,
    MenuResponsableComponent,
    MenuGerantComponent,
    MenuDemarcheurComponent,
    MenuNotaireComponent,
    MenuProprietaireComponent,
    BiensContratsComponent,
    BiensPlanificationsPaiementsComponent,
    BiensPaiementsComponent,
    DelegationGestionAddComponent,
    BienDelegueUpdateComponent,
    AgentImmobilierAddComponent,
    ResponsableAgenceAddComponent,
    DetailResponsableComponent,
    DetailAgentImmobilierComponent,
    AddAgenceImmobiliereComponent,
    UpdateAgenceImmobiliereComponent,
    DetailAgenceImmobiliereComponent,
    DetailServiceAgenceComponent,
    AddServiceAgenceComponent,
    UpdateServiceAgenceComponent,
    UpdateServiceComponent,
    AddServiceComponent,
    DetailServiceComponent,
    AddBienImmobilierComponent,
    UpdateBienImmobilierComponent,
    AddBienAssocieComponent,
    UpdateBienAssocieComponent,
    DetailBienAssocieComponent,
    DetailBienImmobilierComponent,
    DetailDelegationGestionComponent,
    DetailPublicationComponent,
    UpdatePublicationComponent,
    EffectuerPaiementComponent,
    DetailPlanificationPaiementComponent,
    DetailPaiementComponent,
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    BrowserAnimationsModule,
    AvatarModule,
    ButtonModule,
    InputNumberModule,
    PaginatorModule,
    FileUploadModule,
    ToastModule,
    EditorModule,
    TooltipModule,
    ConfirmDialogModule,
    TagModule,
    AvatarGroupModule,
    DialogModule,
    BadgeModule,
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
    StepsModule,
    InputTextModule,
    MessagesModule,
    MenuModule,
    CalendarModule,
    CommonModule,
    ChartModule,
    ScrollPanelModule,
    SidebarModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    TranslateStore,
    TranslateService,
    TokenInterceptorProvider,
    DatePipe,
    DecimalPipe,
    FilterService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'fr-FR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

