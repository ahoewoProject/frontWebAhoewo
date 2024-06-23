import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Motif } from 'src/app/models/Motif';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ServiceNonTrouveForm } from 'src/app/models/gestionDesAgencesImmobilieres/ServiceNonTrouveForm';
import { Services } from 'src/app/models/gestionDesAgencesImmobilieres/Services';
import { ServicesAgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/ServicesAgenceImmobiliere';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { ServicesAgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/services-agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-services-agence-immobiliere',
  templateUrl: './services-agence-immobiliere.component.html',
  styleUrls: ['./services-agence-immobiliere.component.css']
})
export class ServicesAgenceImmobiliereComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  serviceSelectionne!: Services;
  agenceSelectionnee!: AgenceImmobiliere;
  motif!: Motif;
  recherche: string = '';
  affichage = 1;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  autreService: Services = {
    id: 0,
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    annulerPar: 0,
    annulerLe: new Date(),
    refuserPar: 0,
    refuserLe: new Date(),
    statut: true,
    codeService: "AUTRES",
    nomService: "Autres",
    description: "Description du service Autres",
    etat: 1
  };

  serviceNonTrouveForm: ServiceNonTrouveForm = new ServiceNonTrouveForm();
  serviceAgenceImmobiliere = this.servicesAgenceImmobiliereService.serviceAgenceImmobiliere;
  services: Services[] = [];
  agencesImmobilieres: AgenceImmobiliere[] = [];
  agenceImmobiliere = this.agenceImmobiliereService.agenceImmobiliere;
  servicesAgenceImmobiliere!: Page<ServicesAgenceImmobiliere>;
  messageErreur: string = "";
  messageSuccess: string | null = null;
  serviceForm: any;
  APIEndpoint: string;
  serviceAgenceImmobiliereForm: any;
  ajoutReussi: any;
  modificationReussie: any;
  demandeReussie: any;

  constructor(private personneService: PersonneService, private agenceImmobiliereService: AgenceImmobiliereService,
    private servicesAgenceImmobiliereService: ServicesAgenceImmobiliereService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private activatedRoute: ActivatedRoute,
    private router: Router, private pageVisibilityService: PageVisibilityService,
    private userInactivityService: UserInactivityService
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.loadData();
    this.visibilitySubscription = this.pageVisibilityService.visibilityChange$.subscribe((isVisible) => {
      if (isVisible) {
        this.loadData();
      }
    });
    this.inactivitySubscription = this.userInactivityService.onIdle.subscribe(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.ajoutReussi = this.activatedRoute.snapshot.queryParamMap.get('ajoutReussi') || '';
    this.modificationReussie = this.activatedRoute.snapshot.queryParamMap.get('modificationReussie') || '';
    this.demandeReussie = this.activatedRoute.snapshot.queryParamMap.get('demandeReussie') || '';
    this.initActivatedRoute();
    this.getAgencesImmobilieresListIfUserActif();
  }

  initActivatedRoute(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        const parsedId = parseInt(id, 10);
        this.detailAgenceImmobiliere(parsedId);
        this.listeServices(parsedId, this.numeroDeLaPage, this.elementsParPage);
      } else {
        this.getServicesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
      }
    });
  }

  rafraichir(): void {
    this.getServicesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
  }

  detailAgenceImmobiliere(id: number): void {
    this.agenceImmobiliereService.findById(id).subscribe(
      (data) => {
        this.agenceImmobiliere = data;
      }
    )
  }

  listeServices(id: number, numeroDeLaPage: number, elementsParPage: number): void {
    this.servicesAgenceImmobiliereService.getServicesByIdAgencePage(id, numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.servicesAgenceImmobiliere = response;
      }
    );
  }

  // Fonction pour recupérer les services des agences immobilières
  getServicesAgenceImmobiliere(numeroDeLaPage: number, elementsParPage: number) {
    this.servicesAgenceImmobiliereService.getServicesAgencesPage(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.servicesAgenceImmobiliere = response;
        if (this.ajoutReussi) {
          this.messageService.add({ severity: 'success', summary: 'Ajout reussi', detail: 'Le service a été ajouté avec succès.' });
        }

        if (this.modificationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Modification reussie', detail: 'Le service a été modifié avec succès.' });
        }

        if (this.demandeReussie) {
          this.messageService.add({ severity: 'success', summary: 'Demande envoyée', detail: 'Votre demande a été envoyée avec succès.\nNotre équipe s\'engage à vous fournir un retour dans les plus brefs délais.' });
        }
      }
    );
  }

  // Fonction pour recupérer les agences immobilières (Responsable)
  getAgencesImmobilieresListIfUserActif() {
    this.agenceImmobiliereService.getAgencesImmobilieresListIfUserActif().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  filtrerParAgence(event: any) {
    this.agenceSelectionnee = event.value;
    this.servicesAgenceImmobiliereService.getServicesAgencesPage(this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.servicesAgenceImmobiliere.content = response.content.filter((service) => service.agenceImmobiliere.id == this.agenceSelectionnee.id);
      }
    );
  }

  pagination(event: any) {
    this.ajoutReussi = false;
    this.modificationReussie = false;
    this.demandeReussie = false;
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.getServicesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListeAgencesImmobilieres(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/agences-immobilieres']);
  }

  voirListe(): void {
    this.ajoutReussi = false;
    this.modificationReussie = false;
    this.demandeReussie = false;
    this.getServicesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
  }

  voirPageAjout(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/agences-immobilieres/add/service']);
  }

  voirPageModifier(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/agences-immobilieres/update/service/' + id]);
  }

  voirPageDetail(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/agences-immobilieres/service/' + id]);
  }

  activerServiceAgenceImmobiliere(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce service ?',
      header: "Activation d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.servicesAgenceImmobiliereService.activerServiceAgence(id).subscribe(response=>{
          //console.log(error)(response);
          this.voirListe();
          this.messageSuccess = "Le service a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation du service confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation du service rejetée',
              detail: "Vous avez rejeté l'activation de ce service !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation du service annulée',
              detail: "Vous avez annulé l'activation de ce service !"
            });
            break;
        }
      }
    });
  }

  desactiverServiceAgenceImmobiliere(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce service ?',
      header: "Désactivaction d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.servicesAgenceImmobiliereService.desactiverServiceAgence(id).subscribe(response=>{
          //console.log(error)(response);
          this.voirListe();
          this.messageSuccess = "Le service a été désactivé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivation du service confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation du service rejetée',
              detail: "Vous avez rejeté la désactivation de ce service !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation du service annulée',
              detail: "Vous avez annulé la désactivation de ce service !"
            });
            break;
        }
      }
    });
  }

  navigateURLBYUSER(user: any): string {
    let roleBasedURL = '';

    switch (user.role.code) {
      case 'ROLE_ADMINISTRATEUR':
        roleBasedURL = '/admin';
        break;
      case 'ROLE_PROPRIETAIRE':
        roleBasedURL = '/proprietaire';
        break;
      case 'ROLE_RESPONSABLE':
        roleBasedURL = '/responsable';
        break;
      case 'ROLE_DEMARCHEUR':
        roleBasedURL = '/demarcheur';
        break;
      case 'ROLE_GERANT':
        roleBasedURL = '/gerant';
        break;
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier';
        break;
      case 'ROLE_CLIENT':
        roleBasedURL = '/client';
        break;
      default:
        break;
    }

    return roleBasedURL;
  }

  ngOnDestroy(): void {
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
    if (this.inactivitySubscription) {
      this.inactivitySubscription.unsubscribe();
    }
  }
}
