import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Page } from 'src/app/interfaces/Page';
import { Services } from 'src/app/models/gestionDesAgencesImmobilieres/Services';
import { ServicesService } from 'src/app/services/gestionDesAgencesImmobilieres/services.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { PageVisibilityService } from 'src/app/services/page-visibility.service';
import { UserInactivityService } from 'src/app/services/user-inactivity.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, OnDestroy {

  private visibilitySubscription!: Subscription;
  private inactivitySubscription!: Subscription;
  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;
  user : any;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  _service = this._servicesService._service;
  services!: Page<Services>;
  messageErreur: string = "";
  messageSuccess: string | null = null;
  serviceForm: any;
  ajoutReussi: any;
  modificationReussie: any;

  constructor(private _servicesService: ServicesService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private personneService: PersonneService,
    private router: Router, private activatedRoute: ActivatedRoute,
    private pageVisibilityService: PageVisibilityService, private userInactivityService: UserInactivityService
  )
  {
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
    this.listeServices(this.numeroDeLaPage, this.elementsParPage);
  }

  // Fonction pour recupérer les services
  listeServices(numeroDeLaPage: number, elementsParPage: number) {
    this._servicesService.getServicesPagines(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.services = response;
        if (this.ajoutReussi) {
          this.messageService.add({ severity: 'success', summary: 'Ajout reussi', detail: 'Le service a été ajouté avec succès.' });
        }

        if (this.modificationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Modification reussie', detail: 'Le service a été modifié avec succès.' });
        }
      }
    );
  }

  pagination(event: any) {
    this.ajoutReussi = false;
    this.modificationReussie = false;
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeServices(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListe(): void {
    this.ajoutReussi = false;
    this.modificationReussie = false;
    this.listeServices(this.numeroDeLaPage, this.elementsParPage);
  }

  voirPageAjout(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/add/service']);
  }

  voirPageModifier(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/service/update/' + id]);
  }

  voirPageDetail(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/service/' + id]);
  }

  //Activer un service
  activerService(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce service ?',
      header: "Activation d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._servicesService.activerService(id).subscribe(
        (response) => {
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

  //Désactiver un service
  desactiverService(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce service ?',
      header: "Désactivaction d'un service",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._servicesService.desactiverService(id).subscribe(
        (response) => {
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
