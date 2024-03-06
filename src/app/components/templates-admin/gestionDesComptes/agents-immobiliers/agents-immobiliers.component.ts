import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { AffectationAgentAgence } from 'src/app/models/gestionDesAgencesImmobilieres/AffectationAgentAgence';
import { AgenceImmobiliere } from 'src/app/models/gestionDesAgencesImmobilieres/AgenceImmobiliere';
import { AgentImmobilier } from 'src/app/models/gestionDesComptes/AgentImmobilier';
import { Role } from 'src/app/models/gestionDesComptes/Role';
import { AffectationAgentAgenceService } from 'src/app/services/gestionDesAgencesImmobilieres/affectation-agent-agence.service';
import { AgenceImmobiliereService } from 'src/app/services/gestionDesAgencesImmobilieres/agence-immobiliere.service';
import { AgentImmobilierService } from 'src/app/services/gestionDesComptes/agent-immobilier.service';
import { PersonneService } from 'src/app/services/gestionDesComptes/personne.service';
import { environment } from 'src/environments/environment';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-agents-immobiliers',
  templateUrl: './agents-immobiliers.component.html',
  styleUrls: ['./agents-immobiliers.component.css']
})
export class AgentsImmobiliersComponent implements OnInit, OnDestroy {

  agenceSelectionnee!: AgenceImmobiliere;
  listeDesChoix: any[] | undefined;
  checked: string | undefined;
  recherche: string = '';
  affichage = 1;
  visibleAddForm = 0;

  elementsParPage = 5; // Nombre d'éléments par page
  pageActuelle = 0; // Page actuelle

  agentImmobilier = new AgentImmobilier();
  affectationsAgentAgence: AffectationAgentAgence[] = [];
  agentsImmobiliers: AgentImmobilier[] = [];
  // agentsImmobiliersFiltres: AgentImmobilier[] = [];
  affecationAgentAgence: AffectationAgentAgence = new AffectationAgentAgence();
  affectationAgentAgenceRequest = this.affectationAgentAgenceService.affectationAgentAgenceRequest
  messageErreur: string = "";
  messageSuccess: string | null = null;
  agencesImmobilieres : AgenceImmobiliere[] = [];
  APIEndpoint: string;

  user: any;
  affectationAgentAgenceForm: any;
  roleAgentImmobilier: Role = {
    id: 3,
    code: 'ROLE_AGENTIMMOBILIER',
    libelle: 'Agent immobilier',
    creerPar: 0,
    creerLe: new Date(),
    modifierPar: 0,
    modifierLe: new Date(),
    statut: false
  }

  constructor(
    private affectationAgentAgenceService: AffectationAgentAgenceService,
    private agentImmobilierService: AgentImmobilierService,
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
    if (this.user.role.code == 'ROLE_ADMINISTRATEUR') {
      this.listerAffectationsAgentsImmobiliers();
    } else {
      this.listerAffectationsAgentsParAgence();
      this.listeAgenceImmobilieresResponsable();
      this.listerAgentsImmobiliers();
    }
    this.initAffectationAgentAgenceForm();
  }

  // filtrerAgentImmobilier(event: AutoCompleteCompleteEvent) {
  //   let filtres: any[] = [];
  //   let query = event.query;
  //   for (let i = 0; i < (this.agentsImmobiliers as any[]).length; i++) {
  //       let affectation = (this.agentsImmobiliers as any[])[i];
  //       if (affectation.matricule.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //         filtres.push(affectation);
  //       }
  //   }
  //   this.agentsImmobiliersFiltres = filtres;
  // }

  filtrerParAgence(event: any) {
    this.agenceSelectionnee = event.value;
    this.affectationsAgentAgence = this.affectationsAgentAgence.filter((affectationAgenceAgence) => affectationAgenceAgence.agenceImmobiliere.id == this.agenceSelectionnee.id);
    console.log(this.affectationsAgentAgence);
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

  onChoixChange(event: any): void {
    this.affectationAgentAgenceForm.reset();
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

  //Fonction pour recupérer les agences immobilières par responsable d'agence immobilière
  listeAgenceImmobilieresResponsable(){
    this.agenceImmobiliereService.findAgencesByResponsable().subscribe(
      (response) => {
        this.agencesImmobilieres = response;
      }
    );
  }

  //Liste des agents immobiliers
  listerAgentsImmobiliers(): void {
    this.agentImmobilierService.getAll().subscribe(
      (response) => {
        this.agentsImmobiliers = response;
      }
    )
  }

  //Liste des agents immobiliers des agencies immobilières
  listerAffectationsAgentsImmobiliers(): void {
    this.affectationAgentAgenceService.getAll().subscribe(
      (response) => {
        this.affectationsAgentAgence = response;
      }
    )
  }

  //Liste des agents immobiliers par responsable d'agence immobilière
  listerAffectationsAgentsParAgence(): void {
    this.affectationAgentAgenceService.getAgentsOfAgence().subscribe(
      (response) => {
        this.affectationsAgentAgence = response;
      }
    )
  }

  // Récupération des agents immobiliers de la page courante
  get affectationsAgentAgenceParPage(): any[] {
    return this.affectationsAgentAgence.slice(this.pageActuelle, this.elementsParPage + this.pageActuelle);
  }

  pagination(event: any) {
    this.pageActuelle = event.first;
    this.elementsParPage = event.rows;
    if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listerAffectationsAgentsParAgence();
    } else {
      this.listerAffectationsAgentsImmobiliers();
    }
  }

  voirListe(): void{
    if (this.user.role.code == 'ROLE_RESPONSABLE') {
      this.listerAffectationsAgentsParAgence();
    } else {
      this.listerAffectationsAgentsImmobiliers();
    }
    this.affectationAgentAgenceForm.reset();
    this.affichage = 1;
    this.visibleAddForm = 0;
  }

  annuler(): void {
    this.affectationAgentAgenceForm.reset();
    this.affichage = 0;
    this.visibleAddForm = 1;
  }

  detailAgentImmobilier(id: number): void {
    this.affectationAgentAgenceService.findById(id).subscribe(
      (response) => {
        this.affecationAgentAgence = response;
      }
    );
  }

  afficherPageDetail(id: number): void {
    this.detailAgentImmobilier(id);
    this.affichage = 3;
    this.visibleAddForm = 0;
  }

  afficherFormulaireAjouter(): void {
    this.listeDesChoix = [ 'Nouvel agent immobilier', 'Agent immobilier existant'];
    this.checked = this.listeDesChoix[0];
    const event = {value: this.checked};
    this.onChoixChange(event);
    this.affichage = 0;
    this.visibleAddForm = 1;
  }

  ajouterAffectationAgentAgence(): void {
    if (this.checked == 'Nouvel agent immobilier') {
      this.agentImmobilier.nom = this.affectationAgentAgenceForm.value.nom;
      this.agentImmobilier.prenom = this.affectationAgentAgenceForm.value.prenom;
      this.agentImmobilier.email = this.affectationAgentAgenceForm.value.email;
      this.agentImmobilier.telephone = this.affectationAgentAgenceForm.value.telephone;
      this.agentImmobilier.role = this.roleAgentImmobilier;
      this.affectationAgentAgenceRequest.agentImmobilier = this.agentImmobilier;
      this.affectationAgentAgenceRequest.agenceImmobiliere = this.agenceSelectionnee;
      //console.log(this.affectationAgentAgenceRequest)
      this.affectationAgentAgenceService.ajouterAgentAgence(this.affectationAgentAgenceRequest).subscribe(
        (response) => {
          //console.log(response);
          if (response.id > 0) {
            this.voirListe();
            this.messageSuccess = "L'agent immobilier a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.messageErreur = "Erreur lors de l'ajout de l'agent immobilier !"
            this.afficherFormulaireAjouter();
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
        //console.log(error)
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
    } else if (this.checked == 'Agent immobilier existant') {
      this.affectationAgentAgenceRequest.matricule = this.agentImmobilier.matricule;
      this.affectationAgentAgenceRequest.agenceImmobiliere = this.agenceSelectionnee;
      //console.log(this.affectationAgentAgenceRequest)
      this.affectationAgentAgenceService.ajoutParMatriculeAgent(this.affectationAgentAgenceRequest).subscribe(
        (response) => {
          //console.log(response);
          if (response.id > 0) {
            this.voirListe();
            this.messageSuccess = "L'agent immobilier a été ajouté avec succès.";
            this.messageService.add({
              severity: 'success',
              summary: 'Ajout réussi',
              detail: this.messageSuccess
            });
          } else {
            this.messageErreur = "Erreur lors de l'ajout de l'agent immobilier !"
            this.afficherFormulaireAjouter();
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
        //console.log(error)
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
  }

  activerCompte(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte ?',
      header: "Activation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.activerCompte(id).subscribe(response=>{
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

  desactiverCompte(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte ?',
      header: "Désactivation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.personneService.desactiverCompte(id).subscribe(response=>{
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

  activerCompteAgentAgence(id: number): void {
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir activer ce compte ?',
      header: "Activation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.affectationAgentAgenceService.activerCompteAgentAgence(id).subscribe(response=>{
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

  desactiverCompteAgentAgence(id: number): void{
    this.confirmationService.confirm({
      message: 'Vous êtes sûr de vouloir désactiver ce compte ?',
      header: "Désactivation de compte",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.affectationAgentAgenceService.desactiverCompteAgentAgence(id).subscribe(response=>{
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
