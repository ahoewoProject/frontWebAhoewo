import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AffectationResponsableAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationResponsableAgence';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { ResponsableAgenceImmobiliere } from 'src/app/models/gestionDesComptes/ResponsableAgenceImmobiliere';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { AffectationResponsableAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-responsable-agence.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { ResponsableAgenceImmobiliereService } from 'src/app/services/gestionDesComptes/responsable-agence-immobiliere.service';

@Component({
  selector: 'app-responsable-agence-add',
  templateUrl: './responsable-agence-add.component.html',
  styleUrls: ['./responsable-agence-add.component.css']
})
export class ResponsableAgenceAddComponent implements OnInit, OnDestroy {

  agenceSelectionnee!: AgenceImmobiliere;
  listeDesChoix: any[] | undefined;
  checked: string | undefined;

  affectationResponsableAgence = new AffectationResponsableAgence();
  responsableAgenceImmobiliere = new ResponsableAgenceImmobiliere();
  agencesImmobilieres: AgenceImmobiliere[] = [];
  affectationResponsableAgenceRequest = this.affectationResponsableAgenceService.affectationResponsableAgenceRequest;
  messageErreur: string | null = null;
  messageSuccess: string | null = null;
  affectationResponsableAgenceForm: any;

  roleRespnsable: Role = {
    id: 8,
    code: 'ROLE_RESPONSABLE',
    libelle: 'Responsable d\'agence immobilière',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    annulerPar: 0,
    annulerLe: new Date(),
    refuserPar: 0,
    refuserLe: new Date(),
    statut: false
  }
  user: any;

  constructor(
    private affectationResponsableAgenceService: AffectationResponsableAgenceService, private responsableAgenceImmobiliereService: ResponsableAgenceImmobiliereService,
    private agenceImmobiliereService: AgenceImmobiliereService, private messageService: MessageService,
    private personneService: PersonneService, private router: Router
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.getAgencesImmobilieresListIfUserActif();
    this.initAffectationResponsableAgenceForm();
    this.initListeDesChoix();
  }


  initAffectationResponsableAgenceForm(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.affectationResponsableAgenceForm = new FormGroup({
      matricule: new FormControl('', [Validators.required]),
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      telephone: new FormControl('', [Validators.required]),
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

  //Fonction pour recupérer une agence immobilière (Responsable)
  getAgencesImmobilieresListIfUserActif(){
    this.agenceImmobiliereService.getAgencesImmobilieresListIfUserActif().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
        this.agenceSelectionnee = this.agencesImmobilieres[0];
      }
    );
  }

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/co-responsables']);
  }

  onChoixChange(event: any): void {
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

  initListeDesChoix(): void {
    this.listeDesChoix = [ 'Nouveau responsable', 'Responsable existant'];
    this.checked = this.listeDesChoix[0];
    const event = {value: this.checked};
    this.onChoixChange(event);
  }

  ajouterAffectationResponsableAgence(): void {
    if (this.checked == 'Nouveau responsable') {
      this.ajoutNouveauResponsable();
    } else if (this.checked == 'Responsable existant') {
      this.ajoutResponsableExistant();
    }
  }

  ajoutNouveauResponsable(): void {
    this.responsableAgenceImmobiliere.nom = this.affectationResponsableAgenceForm.value.nom;
    this.responsableAgenceImmobiliere.prenom = this.affectationResponsableAgenceForm.value.prenom;
    this.responsableAgenceImmobiliere.email = this.affectationResponsableAgenceForm.value.email;
    this.responsableAgenceImmobiliere.telephone = this.affectationResponsableAgenceForm.value.telephone;
    this.responsableAgenceImmobiliere.role = this.roleRespnsable;
    this.affectationResponsableAgenceRequest.responsable = this.responsableAgenceImmobiliere;
    this.affectationResponsableAgenceRequest.agenceImmobiliere = this.agenceSelectionnee;
    this.affectationResponsableAgenceService.ajouterResponsableAgence(this.affectationResponsableAgenceRequest).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/co-responsables'], { queryParams: { ajoutReussi: true } });
        } else {
          this.messageErreur = "Erreur lors de l'ajout du co - responsable !"
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
  }

  ajoutResponsableExistant(): void {
    this.affectationResponsableAgenceRequest.matricule = this.responsableAgenceImmobiliere.matricule;
    this.affectationResponsableAgenceRequest.agenceImmobiliere = this.agenceSelectionnee;
    this.affectationResponsableAgenceService.ajoutParMatriculeResponsable(this.affectationResponsableAgenceRequest).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/co-responsables'], { queryParams: { ajoutReussi: true } });
        } else {
          this.messageErreur = "Erreur lors de l'ajout du co - responsable !"
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
