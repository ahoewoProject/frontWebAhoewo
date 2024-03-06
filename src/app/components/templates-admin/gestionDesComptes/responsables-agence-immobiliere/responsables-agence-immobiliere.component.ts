import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  listeDesChoix: any[] | undefined;
  checked: string | undefined;
  visibleAddForm = 0;
  recherche: string = '';
  affichage = 1;

  elementsParPage = 5; // Nombre d'éléments par page
  numeroDeLaPage = 0; // Page actuelle

  affectationResponsableAgence = new AffectationResponsableAgence();
  responsableAgenceImmobiliere = new ResponsableAgenceImmobiliere();
  responsablesAgenceImmobiliere!: Page<ResponsableAgenceImmobiliere>;
  affectationsResponsableAgences!: Page<AffectationResponsableAgence>;
  agencesImmobilieres: AgenceImmobiliere[] = [];
  affectationResponsableAgenceRequest = this.affectationResponsableAgenceService.affectationResponsableAgenceRequest;
  messageErreur: string = "";
  messageSuccess: string | null = null;
  affectationResponsableAgenceForm: any;
  user: any;
  APIEndpoint!: string;

  roleRespnsable: Role = {
    id: 8,
    code: 'ROLE_RESPONSABLE',
    libelle: 'Responsable d\'agence immobilière',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  constructor(
    private affectationResponsableAgenceService: AffectationResponsableAgenceService,
    private responsableAgenceImmobiliereService: ResponsableAgenceImmobiliereService,
    private agenceImmobiliereService: AgenceImmobiliereService,
    private personneService: PersonneService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
    this.APIEndpoint = environment.APIEndpoint;
  }

  ngOnInit(): void {
    console.log(this.user.role)
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeResponsablesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.listeAgenceImmobilieresResponsable();
      this.listerResponsablesParAgence(this.numeroDeLaPage, this.elementsParPage);
    }
    this.initAffectationResponsableAgenceForm();
  }

  filtrerParAgence(event: any) {
    this.agenceSelectionnee = event.value;
    this.affectationsResponsableAgences.content = this.affectationsResponsableAgences.content.filter((affectationResponsableAgence) => affectationResponsableAgence.agenceImmobiliere.id == this.agenceSelectionnee.id);
    console.log(this.affectationsResponsableAgences.content);
  }

  initAffectationResponsableAgenceForm(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.affectationResponsableAgenceForm = new FormGroup({
      matricule: new FormControl('', [Validators.required]),
      nom: new FormControl(this.responsableAgenceImmobiliere.nom, [Validators.required]),
      prenom: new FormControl(this.responsableAgenceImmobiliere.prenom, [Validators.required]),
      email: new FormControl(this.responsableAgenceImmobiliere.email, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      telephone: new FormControl(this.responsableAgenceImmobiliere.telephone, [Validators.required]),
      agenceImmobiliere: new FormControl('', [Validators.required])
    })
  }

  get nom() {
    return this.affectationResponsableAgenceForm.get('nom');
  }

  get prenom() {
    return this.affectationResponsableAgenceForm.get('prenom');
  }

  get email() {
    return this.affectationResponsableAgenceForm.get('email');
  }

  get telephone() {
    return this.affectationResponsableAgenceForm.get('telephone');
  }

  get agenceImmobiliere() {
    return this.affectationResponsableAgenceForm.get('agenceImmobiliere');
  }

  get matricule() {
    return this.affectationResponsableAgenceForm.get('matricule');
  }

  //Fonction pour recupérer une agence immobilière par responsable d'agence immobilière
  listeAgenceImmobilieresResponsable(){
    this.agenceImmobiliereService.findAgencesByResponsable().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  listerResponsablesParAgence(numeroDeLaPage: number, elementsParPage: number): void {
    this.affectationResponsableAgenceService.getResponsablesOfAgencesPagines(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        console.log(response)
        this.affectationsResponsableAgences = response;
      }
    );
  }

  listeResponsablesAgenceImmobiliere(numeroDeLaPage: number, elementsParPage: number): void {
    this.responsableAgenceImmobiliereService.getResponsables(numeroDeLaPage, elementsParPage).subscribe(
      (response) => {
        this.responsablesAgenceImmobiliere = response;
      }
    );
  }

  pagination(event: any) {
    this.numeroDeLaPage = event.first / event.rows;
    this.elementsParPage = event.rows;
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeResponsablesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.listerResponsablesParAgence(this.numeroDeLaPage, this.elementsParPage);
    }
  }

  voirListe(): void {
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listeResponsablesAgenceImmobiliere(this.numeroDeLaPage, this.elementsParPage);
    } else {
      this.listerResponsablesParAgence(this.numeroDeLaPage, this.elementsParPage);
    }
    this.visibleAddForm = 0;
    this.affichage = 1;
  }

  annuler(): void {
    this.affectationResponsableAgenceForm.reset();
    this.affichage = 0;
    this.visibleAddForm = 1;
  }

  detailResponsableAgenceImmobiliere(id: number): void {
    this.responsableAgenceImmobiliereService.findById(id).subscribe(
      (response) => {
        this.responsableAgenceImmobiliere = response;
        console.log(response);
      }
    );
  }

  detailAffectationResponsableAgence(id: number): void {
    this.agenceImmobiliereService.detailAffectation(id).subscribe(
      (response) => {
        this.affectationResponsableAgence = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.detailResponsableAgenceImmobiliere(id);
    } else {
      this.detailAffectationResponsableAgence(id);
    }
    this.affichage = 2;
  }

  onChoixChange(event: any): void {
    this.affectationResponsableAgenceForm.reset();
    this.checked = event.value;
    if (this.checked == 'Responsable existant') {
      this.nom.clearValidators();
      this.prenom.clearValidators();
      this.email.clearValidators();
      this.telephone.clearValidators();
      this.agenceImmobiliere.setValidators([Validators.required]);
      this.matricule.setValidators([Validators.required]);
    } else if (this.checked == 'Nouveau responsable') {
      this.nom.setValidators([Validators.required]);
      this.prenom.setValidators([Validators.required]);
      this.email.setValidators([Validators.required, Validators.email]);
      this.telephone.setValidators([Validators.required]);
      this.agenceImmobiliere.setValidators([Validators.required]);
      this.matricule.clearValidators();
    }
    this.matricule.updateValueAndValidity();
    this.nom.updateValueAndValidity();
    this.prenom.updateValueAndValidity();
    this.email.updateValueAndValidity();
    this.telephone.updateValueAndValidity();
    this.agenceImmobiliere.updateValueAndValidity();
  }

  agenceChoisie(event: any) {
    this.agenceSelectionnee = event.value;
  }

  afficherFormulaireAjouter(): void {
    this.listeDesChoix = [ 'Nouveau responsable', 'Responsable existant'];
    this.checked = this.listeDesChoix[0];
    const event = {value: this.checked};
    this.onChoixChange(event);
    this.affichage = 0;
    this.visibleAddForm = 1;
  }

  ajouterAffectationResponsableAgence(): void {
    if (this.checked == 'Nouveau responsable') {
      this.responsableAgenceImmobiliere.nom = this.affectationResponsableAgenceForm.value.nom;
      this.responsableAgenceImmobiliere.prenom = this.affectationResponsableAgenceForm.value.prenom;
      this.responsableAgenceImmobiliere.email = this.affectationResponsableAgenceForm.value.email;
      this.responsableAgenceImmobiliere.telephone = this.affectationResponsableAgenceForm.value.telephone;
      this.responsableAgenceImmobiliere.role = this.roleRespnsable;
      this.affectationResponsableAgenceRequest.responsable = this.responsableAgenceImmobiliere;
      this.affectationResponsableAgenceRequest.agenceImmobiliere = this.agenceSelectionnee;
      //console.log(this.affectationAgentAgenceRequest)
      this.affectationResponsableAgenceService.ajouterResponsableAgence(this.affectationResponsableAgenceRequest).subscribe(
        (response) => {
          //console.log(response);
          if (response.id > 0) {
            this.voirListe();
            this.messageSuccess = "Le co - responsable a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.messageErreur = "Erreur lors de l'ajout du co - responsable !"
            this.afficherFormulaireAjouter();
            this.responsableAgenceImmobiliere.nom = response.responsable.nom;
            this.responsableAgenceImmobiliere.prenom = response.responsable.prenom;
            this.responsableAgenceImmobiliere.email = response.responsable.email;
            this.responsableAgenceImmobiliere.telephone = response.responsable.telephone;
            this.responsableAgenceImmobiliere.matricule = response.responsable.matricule;
            this.agenceSelectionnee = response.agenceImmobiliere;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur d'ajout",
              detail: this.messageErreur
            });
          }
      },
      (error) =>{
        //console.log(error)
        if (error.message == "Ce responsable à été déjà affecté à cette agence.") {
          this.messageErreur = "Ce co - responsable à été déjà affecté à cette agence !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Ajout non réussi',
            detail: this.messageErreur
          });
        } else if (error.message == "Un responsable avec cette adresse e-mail existe déjà." ) {
          this.messageErreur = "Un co - responsable avec cette adresse e-mail existe déjà !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Ajout non réussi',
            detail: this.messageErreur
          });
        }
      })
    } else if (this.checked == 'Responsable existant') {
      this.affectationResponsableAgenceRequest.matricule = this.responsableAgenceImmobiliere.matricule;
      this.affectationResponsableAgenceRequest.agenceImmobiliere = this.agenceSelectionnee;
      //console.log(this.affectationAgentAgenceRequest)
      this.affectationResponsableAgenceService.ajoutParMatriculeResponsable(this.affectationResponsableAgenceRequest).subscribe(
        (response) => {
          //console.log(response);
          if (response.id > 0) {
            this.voirListe();
            this.messageSuccess = "Le co - responsable a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.messageErreur = "Erreur lors de l'ajout du co - responsable !"
            this.afficherFormulaireAjouter();
            this.responsableAgenceImmobiliere.matricule = response.responsable.matricule;
            this.agenceSelectionnee = response.agenceImmobiliere;
            this.messageService.add({
              severity: 'error',
              summary: "Erreur d'ajout",
              detail: this.messageErreur
            });
          }
      },
      (error) =>{
        //console.log(error)
        if (error.status == 409) {
          this.messageErreur = "Un co - responsable avec cette adresse e-mail existe déjà !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Ajout non réussi',
            detail: this.messageErreur
          });
        } else if (error.status == 404) {
          this.messageErreur = "La matricule du co - responsable est introuvable !";
          this.messageService.add({
            severity: 'warn',
            summary: 'Ajout non réussi',
            detail: this.messageErreur
          });
        }
      })
    }
  }

  supprimerResponsableAgenceImmobiliere(id: number): void {
    this.responsableAgenceImmobiliereService.deleteById(id).subscribe(
      (response) => {
        //console.log(response);
        this.voirListe();
        this.messageSuccess = "Le client a été supprimé avec succès.";
        this.messageService.add({
          severity: 'success',
          summary: 'Suppression réussie',
          detail: this.messageSuccess
        });
      }
    );
  }

  activerCompte(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte ?',
      header: "Activation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.activerCompte(id).subscribe(response=>{
          //console.log(response);
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
        this.personneService.desactiverCompte(id).subscribe(response=>{
          //console.log(response);
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
        this.affectationResponsableAgenceService.activerCompteResponsableAgence(id).subscribe(response=>{
          console.log(response);
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
        this.affectationResponsableAgenceService.desactiverCompteResponsableAgence(id).subscribe(response=>{
          //console.log(response);
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

  ngOnDestroy(): void {

  }
}
