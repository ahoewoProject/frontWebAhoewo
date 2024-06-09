import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { AffectationResponsableAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationResponsableAgence';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ResponsableAgenceImmobiliere } from 'src/app/models/gestionDesComptes/ResponsableAgenceImmobiliere';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { AffectationResponsableAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-responsable-agence.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ResponsableAgenceImmobiliereService } from 'src/app/services/gestionDesComptes/responsable-agence-immobiliere.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-responsables-agence-immobiliere',
  templateUrl: './responsables-agence-immobiliere.component.html',
  styleUrls: ['./responsables-agence-immobiliere.component.css']
})
export class ResponsablesAgenceImmobiliereComponent implements OnInit, OnDestroy {

  agenceSelectionnee!: AgenceImmobiliere;
  recherche: string = '';

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  responsablesAgenceImmobiliere!: Page<ResponsableAgenceImmobiliere>;
  affectationsResponsableAgences!: Page<AffectationResponsableAgence>;
  agencesImmobilieres: AgenceImmobiliere[] = [];
  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  user: any;
  APIEndpoint!: string;
  ajoutReussi: any;

  constructor(
    private affectationResponsableAgenceService: AffectationResponsableAgenceService, private responsableAgenceImmobiliereService: ResponsableAgenceImmobiliereService,
    private agenceImmobiliereService: AgenceImmobiliereService, private personneService: PersonneService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private router: Router, private activatedRoute: ActivatedRoute
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
    this.APIEndpoint = environment.APIEndpoint;
  }

  ngOnInit(): void {
    this.ajoutReussi = this.activatedRoute.snapshot.queryParamMap.get('ajoutReussi') || '';
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.getResponsablesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.getAgencesImmobilieresListIfUserActif();
      this.getAffectationsReponsableAgencePage(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  filtrerResponsableParAgence(event: any) {
    this.agenceSelectionnee = event.value;
    this.affectationResponsableAgenceService.getAffectationsReponsableAgencePage(this.numeroDeLaPage, this.elementsParPage).subscribe(
      (response) => {
        this.affectationsResponsableAgences.content = response.content.filter((affectationResponsableAgence) => affectationResponsableAgence.agenceImmobiliere.id == this.agenceSelectionnee.id);
      }
    );
  }

  //Fonction pour recupérer une agence immobilière (Responsable)
  getAgencesImmobilieresListIfUserActif(){
    this.agenceImmobiliereService.getAgencesImmobilieresListIfUserActif().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  getAffectationsReponsableAgencePage(numeroDeLaPage: number, elementsParPage: number): void {
    this.affectationResponsableAgenceService.getAffectationsReponsableAgencePage(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.affectationsResponsableAgences = response;
        if (this.ajoutReussi) {
          this.messageService.add({ severity: 'success', summary: 'Ajout reussi', detail: 'Le co-responsable a été ajouté avec succès.' });
        }
      }
    );
  }

  getResponsablesAgenceImmobiliere(numeroDeLaPage: number, elementsParPage: number): void {
    this.responsableAgenceImmobiliereService.getResponsables(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.responsablesAgenceImmobiliere = response;
      }
    );
  }

  pagination(event: any) {
    this.ajoutReussi = false;
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.getResponsablesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.getAffectationsReponsableAgencePage(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  voirListe(): void {
    this.ajoutReussi = false;
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.getResponsablesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.getAffectationsReponsableAgencePage(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  voirPageAjout(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/add/co-responsable']);
  }

  voirPageDetail(id: number): void {
    if (this.personneService.estAdmin(this.user.role.code)) {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/responsable/' + id]);
    } else {
      this.router.navigate([this.navigateURLBYUSER(this.user) + '/co-responsable/' + id]);
    }
  }

  activerCompte(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte ?',
      header: "Activation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.activerCompte(id).subscribe(
          (response) => {
          this.voirListe();
          this.messageSuccess = "Le compte a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation de compte confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation de compte rejetée',
              detail: "Vous avez rejeté l'activation de ce compte !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation de compte annulée',
              detail: "Vous avez annulé l'activation de ce compte !"
            });
            break;
        }
      }
    });
  }

  desactiverCompte(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte ?',
      header: "Désactivation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.desactiverCompte(id).subscribe(
          (response) => {
          this.voirListe();
          this.messageSuccess = "Le compte a été désactivé avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivaction de compte confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation de compte rejetée',
              detail: 'Vous avez rejeté la désactivation de ce compte !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation de compte annulée',
              detail: 'Vous avez annulé la désactivation de ce compte !'
            });
            break;
        }
      }
    });
  }

  activerCompteResponsableAgence(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte ?',
      header: "Activation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.affectationResponsableAgenceService.activerCompteResponsableAgence(id).subscribe(
          (response) => {
          this.voirListe();
          this.messageSuccess = "Le compte a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation de compte confirmée',
            detail: this.messageSuccess })
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation de compte rejetée',
              detail: "Vous avez rejeté l'activation de ce compte !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation de compte annulée',
              detail: "Vous avez annulé l'activation de ce compte !"
            });
            break;
        }
      }
    });
  }

  desactiverCompteResponsableAgence(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte ?',
      header: "Désactivation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.affectationResponsableAgenceService.desactiverCompteResponsableAgence(id).subscribe(
          (response) => {
          this.voirListe();
          this.messageSuccess = "Le compte a été désactivé avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivaction de compte confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation de compte rejetée',
              detail: 'Vous avez rejeté la désactivation de ce compte !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn', summary: 'Désactivation de compte annulée',
              detail: 'Vous avez annulé la désactivation de ce compte !'
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
        roleBasedURL = '/responsable/agences-immobilieres';
        break;
      case 'ROLE_DEMARCHEUR':
        roleBasedURL = '/demarcheur';
        break;
      case 'ROLE_GERANT':
        roleBasedURL = '/gerant';
        break;
      case 'ROLE_AGENTIMMOBILIER':
        roleBasedURL = '/agent-immobilier/agences-immobilieres';
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
