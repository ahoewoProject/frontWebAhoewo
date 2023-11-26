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
import { RolesComponent } from './components/templates-admin/roles/roles.component';
import { MenuResponsiveComponent } from './components/templates-admin/menu-responsive/menu-responsive.component';
import { AdministrateursComponent } from './components/templates-admin/administrateurs/administrateurs.component';
import { NotairesComponent } from './components/templates-admin/notaires/notaires.component';
import { ProprietairesComponent } from './components/templates-admin/proprietaires/proprietaires.component';
import { AgentsImmobiliersComponent } from './components/templates-admin/agents-immobiliers/agents-immobiliers.component';
import { DemarcheursComponent } from './components/templates-admin/demarcheurs/demarcheurs.component';
import { GerantsComponent } from './components/templates-admin/gerants/gerants.component';
import { ClientsComponent } from './components/templates-admin/clients/clients.component';
import { ProfilComponent } from './components/templates-admin/profil/profil.component';
import { DemandesCertificationsComponent } from './components/templates-admin/demandes-certifications/demandes-certifications.component';
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
import { AgencesImmobilieresComponent } from './components/templates-admin/agences-immobilieres/agences-immobilieres.component';
import { ServicesComponent } from './components/templates-admin/services/services.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TypesDeBienComponent } from './components/templates-admin/types-de-bien/types-de-bien.component';
import { BiensImmobiliersComponent } from './components/templates-admin/biens-immobiliers/biens-immobiliers.component';
import { DelegationsGestionsComponent } from './components/templates-admin/delegations-gestions/delegations-gestions.component';
import { ResponsablesAgenceImmobiliereComponent } from './components/templates-admin/responsables-agence-immobiliere/responsables-agence-immobiliere.component';
import { ServicesAgenceImmobiliereComponent } from './components/templates-admin/services-agence-immobiliere/services-agence-immobiliere.component';

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
    ServicesAgenceImmobiliereComponent
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
    ProgressSpinnerModule
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
