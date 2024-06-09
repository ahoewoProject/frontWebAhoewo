import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { AffectationAgentAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationAgentAgence';
import { AffectationResponsableAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationResponsableAgence';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ServicesAgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/ServicesAgenceImmobiliere';
import { Pays } from 'src/app/models/gestionDesBiensImmobiliers/Pays';
import { Quartier } from 'src/app/models/gestionDesBiensImmobiliers/Quartier';
import { Region } from 'src/app/models/gestionDesBiensImmobiliers/Region';
import { Ville } from 'src/app/models/gestionDesBiensImmobiliers/Ville';
import { AffectationAgentAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-agent-agence.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { ServicesAgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/services-agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agences-immobilieres',
  templateUrl: './agences-immobilieres.component.html',
  styleUrls: ['./agences-immobilieres.component.css']
})
export class AgencesImmobilieresComponent implements OnInit, OnDestroy {

  recherche: string = '';
  logoURL: any;
  affichage = 1;
  visibleAddForm = 0;
  visibleUpdateForm = 0;
  user: any;
  menus: MenuItem[] | undefined;
  activeIndex: number = 0;
  paysSelectionne = new Pays();
  regionSelectionnee = new Region();
  villeSelectionnee = new Ville();
  quartierSelectionne = new Quartier();

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle
  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  agenceImmobiliere = this.agenceImmobiliereService.agenceImmobiliere;
  serviceAgenceImmobiliere = this.servicesAgenceImmobiliereService.serviceAgenceImmobiliere;
  agencesImmobilieres!: Page<AgenceImmobiliere>;
  affectationsResponsableAgences!: Page<AffectationResponsableAgence>;
  affectationsAgentAgence!: Page<AffectationAgentAgence>;
  agencesOfAgent!: Page<AffectationResponsableAgence>;
  servicesAgenceImmobiliere!: Page<ServicesAgenceImmobiliere>;
  affectationResponsableAgence: AffectationResponsableAgence = new AffectationResponsableAgence();
  APIEndpoint: string;
  ajoutReussi: any;
  modificationReussie: any;

  constructor(private agenceImmobiliereService: AgenceImmobiliereService, private affectationAgentAgenceService: AffectationAgentAgenceService,
    private servicesAgenceImmobiliereService: ServicesAgenceImmobiliereService, private personneService: PersonneService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private router: Router, private activatedRoute: ActivatedRoute
  )
  {
    this.APIEndpoint = environment.APIEndpoint;
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.ajoutReussi = this.activatedRoute.snapshot.queryParamMap.get('ajoutReussi') || '';
    this.modificationReussie = this.activatedRoute.snapshot.queryParamMap.get('modificationReussie') || '';
    if (this.personneService.estResponsable(this.user.role.code) || this.personneService.estAdmin(this.user.role.code)) {
      this.getAgencesPages(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.getAffectationsAgentAgencePage(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  //Fonction pour recupérer la liste des agences immobilières
  getAgencesPages(numeroDeLaPage: number, elementsParPage: number) {
    this.agenceImmobiliereService.getAgencesPages(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.agencesImmobilieres = response;
        if (this.ajoutReussi) {
          this.messageService.add({ severity: 'success', summary: 'Ajout reussi', detail: 'L\'agence immobilière a été ajouté avec succès.' });
        }

        if (this.modificationReussie) {
          this.messageService.add({ severity: 'success', summary: 'Modification reussie', detail: 'L\'agence immobilière a été modifié avec succès.' });
        }
      }
    );
  }

  //Lister les agences immobilières par agent immobilier
  getAffectationsAgentAgencePage(numeroDeLaPage: number, elementsParPage: number) {
    this.affectationAgentAgenceService.getAffectationsAgentAgencePage(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.affectationsAgentAgence = response;
      }
    );
  }

  voirPageAjout(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/add/agence-immobiliere']);
  }

  voirPageModifier(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/update/agence-immobiliere/' + id]);
  }

  voirPageDetail(id: number): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/agence-immobiliere/' + id]);
    } else if (this.personneService.estResponsable(this.user.role.code)) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/agence-immobiliere/' + id]);
    } else {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/agence-immobiliere/' + id]);
    }
  }

  pagination(event: any) {
    this.ajoutReussi = false;
    this.modificationReussie = false;
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (this.personneService.estResponsable(this.user.role.code) || this.personneService.estAdmin(this.user.role.code)) {
      this.getAgencesPages(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.getAffectationsAgentAgencePage(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  voirListe(): void {
    this.ajoutReussi = false;
    this.modificationReussie = false;
    if (this.personneService.estResponsable(this.user.role.code) || this.personneService.estAdmin(this.user.role.code)) {
      this.getAgencesPages(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.getAffectationsAgentAgencePage(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  voirPageServices(id: number): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/agence-immobiliere/' + id + '/services']);
  }

  activerAgence(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer cette agence immobilière ?',
      header: "Activation d'une agence immobilière",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.agenceImmobiliereService.activerAgence(id).subscribe(
        (response) => {
          this.voirListe();
          this.messageSuccess = "L'agence immobilière a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: "Activation de l'agence immobilière confirmée",
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: "Activation de l'agence immobilière rejetée",
              detail: "Vous avez rejeté l'activation de cette agence immobilière !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: "Activation de l'agence immobilière annulée",
              detail: "Vous avez annulé l'activation de cette agence immobilière !"
            });
            break;
        }
      }
    });
  }

  desactiverAgence(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver cette agence immobilière ?',
      header: "Désactivation d'une agence immobilière",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.agenceImmobiliereService.desactiverAgence(id).subscribe(
        (response) => {
          this.voirListe();
          this.messageSuccess = "L'agence immobilière a été désactivé avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: "Désactivaction de l'agence immobilière confirmée",
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: "Désactivation de l'agence immobilière rejetée",
              detail: 'Vous avez rejeté la désactivation de cette agence immobilière !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: "Désactivation de l'agence immobilière annulée",
              detail: 'Vous avez annulé la désactivation de cette agence immobilière !'
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

  }
}
