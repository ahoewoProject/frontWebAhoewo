import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Page } from 'src/app/interfaces/Page';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ComptePaiement } from 'src/app/models/gestionDesPaiements/ComptePaiement';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ComptePaiementService } from 'src/app/services/gestionDesPaiements/compte-paiement.service';

@Component({
  selector: 'app-parametres',
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css']
})
export class ParametresComponent implements OnInit {

  recherche: string = '';
  affichage = 1;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  comptePaiement = this.comptePaiementService.comptePaiement;
  comptesPaiements!: Page<ComptePaiement>;
  messageErreur: string = "";
  messageSuccess: string | null = null;
  user: any;
  comptePaiementForm: any;

  typesComptesPaiements: string[] = [];
  typeComptePaiementSelectionne!: string;

  agencesImmobilieres: AgenceImmobiliere[] = [];
  agenceSelectionnee!: AgenceImmobiliere;

  constructor(private comptePaiementService: ComptePaiementService, private personneService: PersonneService,
    private messageService: MessageService, private confirmationService: ConfirmationService,
    private agenceImmobiliereService: AgenceImmobiliereService
  ) {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.getAgencesImmobilieresListIfUserActif();
    this.listeTypeComptesPaiements();
    this.initComptePaiementForm();
    this.listeComptesPaiements(this.numeroDeLaPage, this.elementsParPage);
  }

  initComptePaiementForm(): void {
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const ROLE_RESPONSABLE = 'ROLE_RESPONSABLE';

    this.comptePaiementForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      agenceImmobiliere: new FormControl(''),
      contact: new FormControl(''),
    })

    // Abonnement aux changements de valeur du champ type
    this.comptePaiementForm.get('type').valueChanges.subscribe((value: string) => {
      if (value === 'PayPal') {
        this.comptePaiementForm.get('contact').setValidators([Validators.required, Validators.email, Validators.pattern(EMAIL_REGEX)]);
      } else {
        this.comptePaiementForm.get('contact').setValidators([Validators.required]);
      }
      this.comptePaiementForm.get('contact').updateValueAndValidity();
    });

    if (this.user.role.code === ROLE_RESPONSABLE) {
      this.comptePaiementForm.get('agenceImmobiliere').setValidators([Validators.required]);
    } else {
      this.comptePaiementForm.get('agenceImmobiliere').clearValidators();
    }
    this.comptePaiementForm.get('agenceImmobiliere').updateValueAndValidity();

  }

  get type() {
    return this.comptePaiementForm.get('type');
  }

  get agenceImmobiliere() {
    return this.comptePaiementForm.get('agenceImmobiliere');
  }

  get contact() {
    return this.comptePaiementForm.get('contact');
  }

  listeTypeComptesPaiements(): void {
    this.typesComptesPaiements = ['T-Money', 'Moov-Money', 'PayPal'];
    this.typeComptePaiementSelectionne = this.typesComptesPaiements[0];
  }

  typeComptePaiementChoisi(event: any) {
    this.typeComptePaiementSelectionne = event.value;
  }

  listeComptesPaiements(numeroDeLaPage: number, elementsParPage: number): void {
    this.comptePaiementService.getComptesPaiements(numeroDeLaPage, elementsParPage).subscribe(
      (response => {
        this.comptesPaiements = response;
      })
    )
  }

  //Fonction pour recupérer la liste des agences immobilieres(Responsable/Agent immobilier)
  getAgencesImmobilieresListIfUserActif(): void {
    this.agenceImmobiliereService.getAgencesImmobilieresListIfUserActif().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
        this.agenceSelectionnee = this.agencesImmobilieres[0];
      }
    );
  }

  agenceChoisie(event: any) {
    this.agenceSelectionnee = event.value;
  }

  detailComptePaiement(comptePaiementId: number): void {
    this.comptePaiementService.findById(comptePaiementId).subscribe(
      (response) => {
        this.comptePaiement = response;
      }
    )
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    this.listeComptesPaiements(this.numeroDeLaPage, this.elementsParPage);
  }

  voirListe(): void {
    this.listeComptesPaiements(this.numeroDeLaPage, this.elementsParPage);
    this.comptePaiementForm.reset();
    this.affichage = 1;
  }

  voirPageDetail(comptePaiementId: number): void {
    this.detailComptePaiement(comptePaiementId);
    this.affichage = 2;
  }

  voirPageAjouter(): void {
    this.listeTypeComptesPaiements();
    this.getAgencesImmobilieresListIfUserActif();
    this.comptePaiement = new ComptePaiement();
    this.affichage = 3;
  }

  ajouterComptePaiement(): void {
    if (this.user.role.code != 'ROLE_RESPONSABLE') {
      this.ajouterComptePaiementIfUserNotResponsable();
    } else {
      this.ajouterComptePaiementIfUserIsResponsable();
    }
  }

  ajouterComptePaiementIfUserNotResponsable() {
    this.comptePaiement.type = this.typeComptePaiementSelectionne;
    this.comptePaiement.personne = this.user;
    this.comptePaiementService.ajouterComptePaiement(this.comptePaiement).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le compte de paiement a été enregistré avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Enregistrement réussi',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de l'enregistrement du compte de paiement !";
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'enregistrement",
            detail: this.messageErreur
          });
        }
      },
      (error) => {
        this.messageErreur = "Erreur lors de l'enregistrement du compte de paiement !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'enregistrement",
          detail: this.messageErreur
        });
      }
    )
  }

  ajouterComptePaiementIfUserIsResponsable() {
    this.comptePaiement.type = this.typeComptePaiementSelectionne;
    this.comptePaiement.agenceImmobiliere = this.agenceSelectionnee;
    this.comptePaiementService.ajouterComptePaiement(this.comptePaiement).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le compte de paiement a été enregistré avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Enregistrement réussi',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de l'enregistrement du compte de paiement !";
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'enregistrement",
            detail: this.messageErreur
          });
        }
      },
      (error) => {
        this.messageErreur = "Erreur lors de l'enregistrement du compte de paiement !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur d'enregistrement",
          detail: this.messageErreur
        });
      }
    )
  }

  modifierComptePaiement(comptePaiementId: number): void {
    if (this.user.role.code != 'ROLE_RESPONSABLE') {
      this.modifierComptePaiementIfUserNotResponsable(comptePaiementId);
    } else {
      this.modifierComptePaiementIfUserIsResponsable(comptePaiementId);
    }
  }

  modifierComptePaiementIfUserNotResponsable(comptePaiementId: number) {
    this.comptePaiement.personne = this.user;
    this.comptePaiementService.modifierComptePaiement(comptePaiementId, this.comptePaiement).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirListe();
          this.messageSuccess = "Le compte de paiement a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de la modification du compte de paiement !"
          this.messageService.add({
            severity: 'error',
            summary: "Erreur de modification",
            detail: this.messageErreur
          });
        }
      },
      (error) => {
        this.messageErreur = "Erreur lors de la modification du compte de paiement !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur de modification",
          detail: this.messageErreur
        });
      }
    )
  }

  modifierComptePaiementIfUserIsResponsable(comptePaiementId: number) {
    this.comptePaiement.agenceImmobiliere = this.agenceSelectionnee;
    this.comptePaiementService.modifierComptePaiement(comptePaiementId, this.comptePaiement).subscribe(
      (response) => {
        if (response.id > 0) {
          this.voirPageDetail(response.id);
          this.messageSuccess = "Le compte de paiement a été modifié avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Modification réussie',
            detail: this.messageSuccess
          });
        } else {
          this.messageErreur = "Erreur lors de la modification du compte de paiement !"
          this.messageService.add({
            severity: 'error',
            summary: "Erreur de modification",
            detail: this.messageErreur
          });
        }
      },
      (error) => {
        this.messageErreur = "Erreur lors de la modification du compte de paiement !";
        this.messageService.add({
          severity: 'warn',
          summary: "Erreur de modification",
          detail: this.messageErreur
        });
      }
    )
  }


  voirPageModifier(comptePaiementId: number): void {
    this.detailComptePaiement(comptePaiementId);
    this.affichage = 4;
  }

  activerComptePaiementByPersonne(comptePaiementId: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte de paiement ?',
      header: "Activation du compte de paiement",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.comptePaiementService.activerComptePaiementByPersonne(comptePaiementId).subscribe(
          (response) => {
            this.voirListe();
          this.messageSuccess = "Le compte de paiement a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation du compte de paiement confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation du compte de paiement rejetée',
              detail: "Vous avez rejeté l'activation de ce compte de paiement !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation du compte de paiement annulée',
              detail: "Vous avez annulé l'activation de ce compte de paiement !"
            });
            break;
        }
      }
    });
  }

  desactiverComptePaiementByPersonne(comptePaiementId: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte de paiement ?',
      header: "Désactivation du compte de paiement",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.comptePaiementService.desactiverComptePaiementByPersonne(comptePaiementId).subscribe(
          (response) => {
            this.voirListe();
          this.messageSuccess = "Le compte de paiement a été désactivé avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivaction du compte de paiement confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation du compte de paiement rejetée',
              detail: 'Vous avez rejeté la désactivation de ce compte de paiement !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation du compte de paiement annulée',
              detail: 'Vous avez annulé la désactivation de ce compte de paiement !'
            });
            break;
        }
      }
    });
  }

  activerComptePaiementByAgence(comptePaiementId: number, agenceId: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte de paiement ?',
      header: "Activation du compte de paiement",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.comptePaiementService.activerComptePaiementByAgence(comptePaiementId, agenceId).subscribe(
          (response) => {
            this.voirListe();
          this.messageSuccess = "Le compte de paiement a été activé avec succès !";
          this.messageService.add({
            severity: 'success',
            summary: 'Activation du compte de paiement confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Activation du compte de paiement rejetée',
              detail: "Vous avez rejeté l'activation de ce compte de paiement !"
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Activation du compte de paiement annulée',
              detail: "Vous avez annulé l'activation de ce compte de paiement !"
            });
            break;
        }
      }
    });
  }

  desactiverComptePaiementByAgence(comptePaiementId: number, agenceId: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte de paiement ?',
      header: "Désactivation du compte de paiement",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.comptePaiementService.desactiverComptePaiementByAgence(comptePaiementId, agenceId).subscribe(
          (response) => {
            this.voirListe()
          this.messageSuccess = "Le compte de paiement a été désactivé avec succès.";
          this.messageService.add({
            severity: 'success',
            summary: 'Désactivaction du compte de paiement confirmée',
            detail: this.messageSuccess
          });
        });

      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Désactivation du compte de paiement rejetée',
              detail: 'Vous avez rejeté la désactivation de ce compte de paiement !'
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Désactivation du compte paiement annulée',
              detail: 'Vous avez annulé la désactivation de ce compte de paiement !'
            });
            break;
        }
      }
    });
  }
}
