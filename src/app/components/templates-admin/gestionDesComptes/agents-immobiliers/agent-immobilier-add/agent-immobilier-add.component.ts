import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { AgentImmobilier } from 'src/app/models/gestionDesComptes/AgentImmobilier';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { AffectationAgentAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-agent-agence.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';

@Component({
  selector: 'app-agent-immobilier-add',
  templateUrl: './agent-immobilier-add.component.html',
  styleUrls: ['./agent-immobilier-add.component.css']
})
export class AgentImmobilierAddComponent implements OnInit, OnDestroy {

  agenceSelectionnee!: AgenceImmobiliere;
  listeDesChoix: any[] | undefined;
  checked: string | undefined;

  agentImmobilier = new AgentImmobilier();
  affectationAgentAgenceRequest = this.affectationAgentAgenceService.affectationAgentAgenceRequest
  messageErreur: string = "";
  messageSuccess: string | null = null;
  agencesImmobilieres : AgenceImmobiliere[] = [];

  affectationAgentAgenceForm: any;
  roleAgentImmobilier: Role = {
    id: 3,
    code: 'ROLE_AGENTIMMOBILIER',
    libelle: 'Agent immobilier',
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
  constructor(private messageService: MessageService, private agenceImmobiliereService: AgenceImmobiliereService,
    private affectationAgentAgenceService: AffectationAgentAgenceService, private router: Router,
    private personneService: PersonneService
  )
  {
    const utilisateurConnecte = this.personneService.utilisateurConnecte();
    this.user = JSON.parse(utilisateurConnecte);
  }

  ngOnInit(): void {
    this.getAgencesImmobilieresListIfUserActif();
    this.initAffectationAgentAgenceForm();
    this.initListeDesChoix();
  }

  //Agences immobilières (Pour Responsable)
  getAgencesImmobilieresListIfUserActif(){
    this.agenceImmobiliereService.getAgencesImmobilieresListIfUserActif().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
        this.agenceSelectionnee = this.agencesImmobilieres[0];
      }
    );
  }

  initAffectationAgentAgenceForm(): void {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.affectationAgentAgenceForm = new FormGroup({
      matricule: new FormControl('', [Validators.required]),
      nom: new FormControl(this.agentImmobilier.nom, [Validators.required]),
      prenom: new FormControl(this.agentImmobilier.prenom, [Validators.required]),
      email: new FormControl(this.agentImmobilier.email, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      telephone: new FormControl(this.agentImmobilier.telephone, [Validators.required]),
      agenceImmobiliere: new FormControl('', [Validators.required])
    })
  }

  get nom() {
    return this.affectationAgentAgenceForm.get('nom');
  }

  get prenom() {
    return this.affectationAgentAgenceForm.get('prenom');
  }

  get email() {
    return this.affectationAgentAgenceForm.get('email');
  }

  get telephone() {
    return this.affectationAgentAgenceForm.get('telephone');
  }

  get agenceImmobiliere() {
    return this.affectationAgentAgenceForm.get('agenceImmobiliere');
  }

  get matricule() {
    return this.affectationAgentAgenceForm.get('matricule');
  }

  initListeDesChoix(): void {
    this.listeDesChoix = [ 'Nouvel agent immobilier', 'Agent immobilier existant'];
    this.checked = this.listeDesChoix[0];
    const event = {value: this.checked};
    this.onChoixChange(event);
  }

  onChoixChange(event: any): void {
    this.checked = event.value;
    if (this.checked == 'Agent immobilier existant') {
      this.nom.clearValidators();
      this.prenom.clearValidators();
      this.email.clearValidators();
      this.telephone.clearValidators();
      this.agenceImmobiliere.setValidators([Validators.required]);
      this.matricule.setValidators([Validators.required]);
    } else if (this.checked == 'Nouvel agent immobilier') {
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

  ajouterAffectationAgentAgence(): void {
    if (this.checked == 'Nouvel agent immobilier') {
      this.ajoutNouvelAgent();
    } else if (this.checked == 'Agent immobilier existant') {
      this.ajoutAncienAgent();
    }
  }

  ajoutNouvelAgent(): void {
    this.agentImmobilier.nom = this.affectationAgentAgenceForm.value.nom;
    this.agentImmobilier.prenom = this.affectationAgentAgenceForm.value.prenom;
    this.agentImmobilier.email = this.affectationAgentAgenceForm.value.email;
    this.agentImmobilier.telephone = this.affectationAgentAgenceForm.value.telephone;
    this.agentImmobilier.role = this.roleAgentImmobilier;
    this.affectationAgentAgenceRequest.agentImmobilier = this.agentImmobilier;
    this.affectationAgentAgenceRequest.agenceImmobiliere = this.agenceSelectionnee;
    this.affectationAgentAgenceService.ajouterAgentAgence(this.affectationAgentAgenceRequest).subscribe(
      (response) => {
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/agents-immobiliers'], { queryParams: { ajoutReussi: true } });
        } else {
          this.messageErreur = "Erreur lors de l'ajout de l'agent immobilier !"
          this.agentImmobilier.nom = response.agentImmobilier.nom;
          this.agentImmobilier.prenom = response.agentImmobilier.prenom;
          this.agentImmobilier.email = response.agentImmobilier.email;
          this.agentImmobilier.telephone = response.agentImmobilier.telephone;
          this.agentImmobilier.matricule = response.agentImmobilier.matricule;
          this.agenceSelectionnee = response.agenceImmobiliere;
          this.messageService.add({
            severity: 'error',
            summary: "Erreur d'ajout",
            detail: this.messageErreur
          });
        }
    },
    (error) =>{
      if (error.message == "Cet agent immobilier à été déjà ajouté dans cette agence.") {
        this.messageErreur = "Cet agent immobilier à été déjà ajouté dans cette agence !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Ajout non réussi',
          detail: this.messageErreur
        });
      } else if (error.message == "Un agent immobilier avec cette adresse e-mail existe déjà." ) {
        this.messageErreur = "Un agent immobilier avec cette adresse e-mail existe déjà !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Ajout non réussi',
          detail: this.messageErreur
        });
      }
    })
  }

  ajoutAncienAgent(): void {
    this.affectationAgentAgenceRequest.matricule = this.affectationAgentAgenceForm.value.matricule;
    this.affectationAgentAgenceRequest.agenceImmobiliere = this.agenceSelectionnee;
    this.affectationAgentAgenceService.ajoutParMatriculeAgent(this.affectationAgentAgenceRequest).subscribe(
      (response) => {;
        if (response.id > 0) {
          this.router.navigate([this.navigateURLBYUSER(this.user) + '/agents-immobiliers'], { queryParams: { ajoutReussi: true } });
        } else {
          this.messageErreur = "Erreur lors de l'ajout de l'agent immobilier !"
          this.agentImmobilier.matricule = response.agentImmobilier.matricule;
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
        this.messageErreur = "Cet agent immobilier à été déjà ajouté dans cette agence !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Ajout non réussi',
          detail: this.messageErreur
        });
      } else if (error.status == 404) {
        this.messageErreur = "La matricule de l'agent immobilier est introuvable !";
        this.messageService.add({
          severity: 'warn',
          summary: 'Ajout non réussi',
          detail: this.messageErreur
        });
      }
    })
  }

  voirListe(): void {
    this.router.navigate([this.navigateURLBYUSER(this.user) + '/agents-immobiliers']);
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
